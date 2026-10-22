export type UserRole = 'citizen' | 'authority' | 'ngo' | 'admin';

export type IssueCategory =
  | 'pothole'
  | 'road_damage'
  | 'garbage'
  | 'broken_streetlight'
  | 'open_drain'
  | 'water_leakage'
  | 'damaged_property'
  | 'unsafe_road'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus =
  | 'Submitted'
  | 'AI Analyzed'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface TimelineEvent {
  id: string;
  status: ReportStatus;
  message: string;
  updatedBy: string;
  timestamp: string;
}

export interface CivicReport {
  id: string; // e.g. "SF-2026-000123"
  userId: string;
  userName: string;
  userRole: UserRole;
  issueType: IssueCategory;
  issueTitle: string;
  description: string;
  imageUrl: string;
  resolutionImageUrl?: string;
  latitude: number;
  longitude: number;
  locationName: string;
  landmark?: string;
  villageOrArea: string;
  district: string;
  
  // AI fields
  aiConfidence: number; // 0 - 100
  aiDescription: string;
  detectedSeverity: SeverityLevel;
  
  // Smart Priority Engine
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  priorityFactors: {
    severityWeight: number;
    safetyImpact: number;
    communityReports: number;
    affectedPopulation: number;
    timeFactor: number;
  };
  
  status: ReportStatus;
  supportCount: number;
  supportedByUsers: string[]; // User IDs who upvoted
  
  assignedDepartment?: string;
  assignedOfficer?: string;
  authorityNotes?: string;
  
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AIAnalysisResult {
  issueType: IssueCategory;
  issueTitle: string;
  confidence: number;
  severity: SeverityLevel;
  description: string;
  suggestedDepartment: string;
  safetyRiskScore: number;
  isDemo?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  area: string;
  district: string;
  reportsSubmitted: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'status_update' | 'upvote' | 'community' | 'system';
  read: boolean;
  reportId?: string;
  createdAt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'Infrastructure' | 'Sanitation' | 'Safety' | 'Water' | 'Community';
  location: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  summary: string;
  problemDescription: string;
  solutionProvided: string;
  impactMetrics: {
    label: string;
    value: string;
    change: string;
  }[];
  completionDate: string;
  featured: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  relatedReportId?: string;
  quickActions?: { label: string; action: string }[];
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  organization?: string;
}
