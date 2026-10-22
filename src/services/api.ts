import { CivicReport, CaseStudy, AppNotification, AIAnalysisResult, ContactSubmission } from '../types';

export const api = {
  // Fetch reports with optional filter queries
  async getReports(params?: { category?: string; priority?: string; status?: string; search?: string }): Promise<CivicReport[]> {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`/api/reports?${query}`);
      const data = await res.json();
      return data.reports || [];
    } catch (err) {
      console.warn('API fetch failed, falling back to local database');
      return [];
    }
  },

  // Create report
  async createReport(reportData: Partial<CivicReport>): Promise<CivicReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    const data = await res.json();
    return data.report;
  },

  // Update status (Authority)
  async updateReportStatus(
    id: string,
    updateData: {
      status: string;
      assignedDepartment?: string;
      assignedOfficer?: string;
      authorityNotes?: string;
      resolutionImageUrl?: string;
      updatedBy?: string;
    }
  ): Promise<CivicReport> {
    const res = await fetch(`/api/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    return data.report;
  },

  // Upvote / Support
  async supportReport(id: string, userId: string = 'current_user'): Promise<{ supportCount: number; priorityScore: number }> {
    const res = await fetch(`/api/reports/${id}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return { supportCount: data.supportCount, priorityScore: data.priorityScore };
  },

  // Duplicate Check
  async checkDuplicate(latitude: number, longitude: number, issueType: string) {
    try {
      const res = await fetch('/api/reports/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, issueType }),
      });
      return await res.json();
    } catch {
      return { hasDuplicate: false };
    }
  },

  // AI Vision Image Analysis (Server-side Gemini Vision)
  async analyzeImage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<{ isDemo: boolean; analysis: AIAnalysisResult }> {
    const res = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    const data = await res.json();
    return { isDemo: data.isDemo, analysis: data.analysis };
  },

  // Case Studies
  async getCaseStudies(): Promise<CaseStudy[]> {
    try {
      const res = await fetch('/api/case-studies');
      const data = await res.json();
      return data.caseStudies || [];
    } catch {
      return [];
    }
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      return data.notifications || [];
    } catch {
      return [];
    }
  },

  // Chatbot Query
  async sendChatMessage(message: string): Promise<string> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      return data.reply;
    } catch {
      return 'Thank you for reaching out to SPOT FIX! You can report civic problems or track your existing complaint using your Report ID.';
    }
  },

  // Contact Form
  async submitContactForm(formData: ContactSubmission): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await res.json();
  },
};
