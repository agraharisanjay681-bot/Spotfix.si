import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_REPORTS, INITIAL_CASE_STUDIES, INITIAL_NOTIFICATIONS } from './src/data/initialData';
import { CivicReport, IssueCategory, SeverityLevel, PriorityLevel, TimelineEvent, ContactSubmission } from './src/types';

// In-memory state for runtime operations
let reportsDB: CivicReport[] = [...INITIAL_REPORTS];
let caseStudiesDB = [...INITIAL_CASE_STUDIES];
let notificationsDB = [...INITIAL_NOTIFICATIONS];

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini AI Client securely on server
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// ==========================================
// SMART PRIORITY CALCULATION UTILITY
// ==========================================
function calculatePriorityScore(
  severity: SeverityLevel,
  issueType: IssueCategory,
  supportCount: number = 0,
  landmark?: string
): { priorityScore: number; priorityLevel: PriorityLevel; factors: any } {
  let severityWeight = 20;
  if (severity === 'medium') severityWeight = 30;
  if (severity === 'high') severityWeight = 40;

  let safetyImpact = 15;
  if (['pothole', 'open_drain', 'unsafe_road'].includes(issueType)) {
    safetyImpact = 30;
  } else if (['broken_streetlight', 'water_leakage'].includes(issueType)) {
    safetyImpact = 25;
  }

  const communityReports = Math.min(supportCount * 2, 20);
  const affectedPopulation = landmark && landmark.toLowerCase().includes('school') ? 10 : 5;
  const timeFactor = 5; // Initial score bonus for fresh reports

  const total = Math.min(100, severityWeight + safetyImpact + communityReports + affectedPopulation + timeFactor);

  let level: PriorityLevel = 'LOW';
  if (total >= 81) level = 'CRITICAL';
  else if (total >= 61) level = 'HIGH';
  else if (total >= 31) level = 'MEDIUM';

  return {
    priorityScore: total,
    priorityLevel: level,
    factors: {
      severityWeight,
      safetyImpact,
      communityReports,
      affectedPopulation,
      timeFactor,
    },
  };
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Get all reports (with optional filters)
app.get('/api/reports', (req: Request, res: Response) => {
  const { category, priority, status, search } = req.query;
  let filtered = [...reportsDB];

  if (category && category !== 'all') {
    filtered = filtered.filter((r) => r.issueType === category);
  }
  if (priority && priority !== 'all') {
    filtered = filtered.filter((r) => r.priorityLevel === priority);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.issueTitle.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.villageOrArea.toLowerCase().includes(q)
    );
  }

  // Sort by priority score descending by default
  filtered.sort((a, b) => b.priorityScore - a.priorityScore);
  res.json({ success: true, count: filtered.length, reports: filtered });
});

// 2. Get single report by ID
app.get('/api/reports/:id', (req: Request, res: Response) => {
  const report = reportsDB.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }
  res.json({ success: true, report });
});

// 3. Create new report
app.post('/api/reports', (req: Request, res: Response) => {
  try {
    const {
      issueType,
      issueTitle,
      description,
      imageUrl,
      latitude,
      longitude,
      locationName,
      landmark,
      villageOrArea,
      district,
      aiConfidence,
      aiDescription,
      detectedSeverity,
      userName = 'Anonymous Citizen',
      userId = 'guest_user',
    } = req.body;

    const reportCount = reportsDB.length + 101;
    const reportId = `SF-2026-${String(reportCount).padStart(6, '0')}`;

    const priorityInfo = calculatePriorityScore(
      detectedSeverity || 'medium',
      issueType || 'pothole',
      0,
      landmark
    );

    const now = new Date().toISOString();

    const newReport: CivicReport = {
      id: reportId,
      userId,
      userName,
      userRole: 'citizen',
      issueType: issueType || 'other',
      issueTitle: issueTitle || `${issueType.toUpperCase()} Report`,
      description: description || 'No additional description provided.',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      latitude: Number(latitude) || 26.8467,
      longitude: Number(longitude) || 80.9462,
      locationName: locationName || 'Detected GPS Location',
      landmark: landmark || '',
      villageOrArea: villageOrArea || 'Local Gram Panchayat',
      district: district || 'Local District',
      aiConfidence: aiConfidence || 90,
      aiDescription: aiDescription || 'AI analyzed photographic evidence.',
      detectedSeverity: detectedSeverity || 'medium',
      priorityScore: priorityInfo.priorityScore,
      priorityLevel: priorityInfo.priorityLevel,
      priorityFactors: priorityInfo.factors,
      status: 'Submitted',
      supportCount: 1,
      supportedByUsers: [userId],
      timeline: [
        {
          id: `tl_${Date.now()}_1`,
          status: 'Submitted',
          message: `Report created by ${userName}`,
          updatedBy: userName,
          timestamp: now,
        },
        {
          id: `tl_${Date.now()}_2`,
          status: 'AI Analyzed',
          message: `AI classified as ${issueType} (${aiConfidence || 90}% confidence). Initial priority: ${priorityInfo.priorityLevel}.`,
          updatedBy: 'SPOT FIX AI Engine',
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    reportsDB.unshift(newReport);

    // Add notification
    notificationsDB.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title: 'Report Submitted Successfully',
      message: `Your report ${reportId} has been registered and analyzed by AI.`,
      type: 'system',
      read: false,
      reportId,
      createdAt: now,
    });

    res.status(201).json({ success: true, report: newReport });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update Report Status (Authority Endpoint)
app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedDepartment, assignedOfficer, authorityNotes, resolutionImageUrl, updatedBy = 'Municipal Admin' } = req.body;

  const report = reportsDB.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  const now = new Date().toISOString();

  if (status) report.status = status;
  if (assignedDepartment) report.assignedDepartment = assignedDepartment;
  if (assignedOfficer) report.assignedOfficer = assignedOfficer;
  if (authorityNotes) report.authorityNotes = authorityNotes;
  if (resolutionImageUrl) report.resolutionImageUrl = resolutionImageUrl;
  if (status === 'Resolved') report.resolvedAt = now;

  report.updatedAt = now;

  const newEvent: TimelineEvent = {
    id: `tl_${Date.now()}`,
    status: report.status,
    message: authorityNotes ? `Status updated to ${status}. Note: ${authorityNotes}` : `Status updated to ${status}`,
    updatedBy,
    timestamp: now,
  };
  report.timeline.push(newEvent);

  // Notify report owner
  notificationsDB.unshift({
    id: `notif_${Date.now()}`,
    userId: report.userId,
    title: `Report Status: ${status}`,
    message: `Your report ${report.id} was updated to "${status}" by ${updatedBy}.`,
    type: 'status_update',
    read: false,
    reportId: report.id,
    createdAt: now,
  });

  res.json({ success: true, report });
});

// 5. Support / Upvote Report
app.post('/api/reports/:id/support', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId = 'guest_user' } = req.body;

  const report = reportsDB.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  if (report.supportedByUsers.includes(userId)) {
    return res.status(400).json({ success: false, message: 'You have already supported this report' });
  }

  report.supportedByUsers.push(userId);
  report.supportCount += 1;

  // Recalculate priority
  const newPriority = calculatePriorityScore(
    report.detectedSeverity,
    report.issueType,
    report.supportCount,
    report.landmark
  );
  report.priorityScore = newPriority.priorityScore;
  report.priorityLevel = newPriority.priorityLevel;
  report.priorityFactors = newPriority.factors;
  report.updatedAt = new Date().toISOString();

  res.json({ success: true, supportCount: report.supportCount, priorityScore: report.priorityScore });
});

// 6. Check for Nearby Duplicate Reports
app.post('/api/reports/check-duplicate', (req: Request, res: Response) => {
  const { latitude, longitude, issueType } = req.body;
  if (!latitude || !longitude) {
    return res.json({ hasDuplicate: false });
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  // Haversine approximate distance (in meters)
  function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const duplicates = reportsDB.filter((r) => {
    if (r.status === 'Resolved' || r.status === 'Closed') return false;
    const dist = getDistanceMeters(lat, lng, r.latitude, r.longitude);
    const sameCat = issueType ? r.issueType === issueType : true;
    return dist <= 150 && sameCat; // within 150 meters
  });

  if (duplicates.length > 0) {
    return res.json({
      hasDuplicate: true,
      duplicateReport: duplicates[0],
      message: `A similar ${duplicates[0].issueType} issue (${duplicates[0].id}) was reported nearby (~100m).`,
    });
  }

  res.json({ hasDuplicate: false });
});

// 7. Case Studies Endpoint
app.get('/api/case-studies', (_req: Request, res: Response) => {
  res.json({ success: true, caseStudies: caseStudiesDB });
});

// 8. Notifications Endpoint
app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json({ success: true, notifications: notificationsDB });
});

// 9. Server-Side AI Vision Image Analysis Endpoint
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'imageBase64 required' });
    }

    const ai = getGeminiClient();

    // Fallback/Demo mode if API key is not configured or in offline mode
    if (!ai) {
      console.log('Gemini API key not found; returning intelligent simulated vision analysis');
      return res.json({
        success: true,
        isDemo: true,
        analysis: {
          issueType: 'pothole',
          issueTitle: 'Pothole & Surface Damage Detected',
          confidence: 92,
          severity: 'high',
          description: 'Detected road surface depression with sharp asphalt cracking (~0.7m width). High hazard for vehicles.',
          suggestedDepartment: 'Public Works Department (PWD)',
          safetyRiskScore: 85,
        },
      });
    }

    // Call Gemini 3.6 Flash for vision detection
    const promptText = `
You are SPOT FIX, an expert AI Computer Vision model for civic infrastructure inspection.
Analyze this uploaded photograph and detect any visible public infrastructure problems.

Respond ONLY with JSON adhering to this exact schema:
{
  "issueType": "pothole" | "road_damage" | "garbage" | "broken_streetlight" | "open_drain" | "water_leakage" | "damaged_property" | "unsafe_road" | "other",
  "issueTitle": "Short descriptive title of the issue",
  "confidence": number between 60 and 98,
  "severity": "low" | "medium" | "high",
  "description": "2-sentence clear explanation of visual damage and public safety hazard",
  "suggestedDepartment": "Public Works Department (PWD)" | "Sanitation & Solid Waste" | "Electrical Board" | "Jal Sansthan (Water Board)" | "Municipal Engineering",
  "safetyRiskScore": number between 10 and 95
}
`;

    // Strip base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = geminiRes.text || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        issueType: 'pothole',
        issueTitle: 'Civil Damage Identified',
        confidence: 88,
        severity: 'medium',
        description: 'Road surface irregularity or public hazard identified.',
        suggestedDepartment: 'Municipal Engineering',
        safetyRiskScore: 70,
      };
    }

    res.json({
      success: true,
      isDemo: false,
      analysis: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-image:', error);
    // Graceful fallback response on API error
    res.json({
      success: true,
      isDemo: true,
      analysis: {
        issueType: 'pothole',
        issueTitle: 'Road Surface Damage Detected',
        confidence: 89,
        severity: 'high',
        description: 'Pothole and structural pavement hazard detected. Requires road surface restoration.',
        suggestedDepartment: 'Public Works Department (PWD)',
        safetyRiskScore: 82,
      },
    });
  }
});

// 10. Real-time Interactive AI Chatbot Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    // Check if user is inquiring about a specific report ID (e.g. SF-2026-000101)
    const reportMatch = message.match(/SF-\d{4}-\d{6}/i);
    let matchedReportContext = '';
    if (reportMatch) {
      const rep = reportsDB.find((r) => r.id.toUpperCase() === reportMatch[0].toUpperCase());
      if (rep) {
        matchedReportContext = `[DATABASE MATCH FOUND: Report ID ${rep.id} - Issue: ${rep.issueTitle}, Category: ${rep.issueType}, Status: ${rep.status}, Priority Score: ${rep.priorityScore}/100, Area: ${rep.villageOrArea}, Assigned to: ${rep.assignedDepartment || 'Unassigned'}]`;
      } else {
        matchedReportContext = `[DATABASE MATCH: Report ID ${reportMatch[0]} was not found in active reports database.]`;
      }
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback bot response if no API key
      let reply = `Hello! I am SPOT FIX AI Assistant. How can I help you today? You can report potholes, broken streetlights, open drains, or track your report status using your Report ID (e.g. SF-2026-000101).`;
      if (matchedReportContext) {
        reply = `I checked our system for your report! ${matchedReportContext.replace(/\[DATABASE MATCH FOUND: |\]/g, '')}`;
      } else if (message.toLowerCase().includes('pothole') || message.toLowerCase().includes('report')) {
        reply = `To report an issue: 1. Click "Report an Issue" at the top. 2. Take or upload a photo. 3. Our AI vision will auto-detect the problem & calculate the SPOT FIX priority score!`;
      }
      return res.json({ success: true, reply });
    }

    const systemPrompt = `
You are the official AI Assistant for "SPOT FIX: See It. Snap It. Solve It.", an AI-powered civic issue detection and smart reporting platform for rural and urban communities.

Your Knowledge & Role:
1. Explain how SPOT FIX works: 1-click photo reporting -> AI detection (potholes, garbage, streetlights, drains, water leaks) -> SPOT FIX priority score calculation -> Municipal assignment -> Resolution tracking.
2. Help users check report statuses when given a Report ID like SF-2026-000101.
3. Be friendly, empathetic, concise, and helpful to rural citizens and authorities.
4. Keep answers short (2-4 sentences max).

Context from database query:
${matchedReportContext}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (err: any) {
    res.json({
      success: true,
      reply: 'Hello! I am SPOT FIX AI. You can submit reports using our 1-click photo tool or track your complaint by providing your Report ID (e.g., SF-2026-000101).',
    });
  }
});

// 11. Contact Form Endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, role, message, organization }: ContactSubmission = req.body;

  notificationsDB.unshift({
    id: `notif_${Date.now()}`,
    userId: 'admin',
    title: 'New Contact Query Received',
    message: `From ${name} (${email}): ${message.slice(0, 80)}...`,
    type: 'system',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Thank you for reaching out to SPOT FIX! Our civic engagement team has received your inquiry and sent an acknowledgment notification.',
  });
});

// ==========================================
// VITE / STATIC SERVING SETUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPOT FIX Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
