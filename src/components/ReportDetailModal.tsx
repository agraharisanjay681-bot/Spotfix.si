import React, { useState } from 'react';
import { CivicReport, UserRole } from '../types';
import { X, MapPin, ThumbsUp, ShieldAlert, Sparkles, CheckCircle2, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../translations';
import { api } from '../services/api';

interface ReportDetailModalProps {
  report: CivicReport | null;
  onClose: () => void;
  onReportUpdated: (updated: CivicReport) => void;
  currentRole: UserRole;
  lang: Language;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onReportUpdated,
  currentRole,
  lang,
}) => {
  if (!report) return null;

  const t = translations[lang];

  const [hasSupported, setHasSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(report.supportCount);
  const [priorityScore, setPriorityScore] = useState(report.priorityScore);

  // Authority editing states
  const [editingStatus, setEditingStatus] = useState(report.status);
  const [department, setDepartment] = useState(report.assignedDepartment || 'Public Works Department (PWD)');
  const [officer, setOfficer] = useState(report.assignedOfficer || 'Er. Inspection Officer');
  const [notes, setNotes] = useState(report.authorityNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSupport = async () => {
    if (!hasSupported) {
      setHasSupported(true);
      const res = await api.supportReport(report.id);
      setSupportCount(res.supportCount);
      setPriorityScore(res.priorityScore);
    }
  };

  const handleSaveAuthorityUpdate = async () => {
    setIsSaving(true);
    try {
      const updated = await api.updateReportStatus(report.id, {
        status: editingStatus,
        assignedDepartment: department,
        assignedOfficer: officer,
        authorityNotes: notes,
      });
      onReportUpdated(updated);
      alert('Authority status and assigned department updated successfully!');
    } catch {
      alert('Error saving status update.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-[var(--brand-card)] rounded-3xl max-w-3xl w-full border border-[var(--brand-border)] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-border-subtle)] bg-[var(--brand-surface)]">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-[var(--brand-card)] text-[var(--brand-primary)] border border-[var(--brand-border)] font-extrabold text-xs">
              {report.id}
            </span>
            <span className="font-bold text-sm text-[var(--brand-text-main)] uppercase">
              {report.issueType.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--brand-text-muted)] hover:text-[var(--brand-text-main)] hover:bg-[var(--brand-surface)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Title & Status Bar */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--brand-text-main)]">
                {report.issueTitle}
              </h2>
              <p className="text-xs text-[var(--brand-text-secondary)] mt-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[var(--brand-primary)] mr-1" />
                {report.locationName} • {report.villageOrArea}, {report.district}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-xs border border-amber-200 dark:border-amber-800">
                Priority {priorityScore}/100 ({report.priorityLevel})
              </span>
              <span className="px-3 py-1.5 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-extrabold text-xs">
                {report.status}
              </span>
            </div>
          </div>

          {/* Photo Showcase (Before & After if resolved) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-[var(--brand-border)] relative bg-[var(--brand-surface)]">
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/80 text-white font-bold text-[10px]">
                Report Photo
              </span>
              <img src={report.imageUrl} alt="Issue" className="w-full h-56 object-cover" />
            </div>

            {report.resolutionImageUrl ? (
              <div className="rounded-2xl overflow-hidden border border-[var(--brand-primary)]/50 relative bg-[var(--brand-surface)]">
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold text-[10px]">
                  ✓ Resolved Proof
                </span>
                <img src={report.resolutionImageUrl} alt="Resolved" className="w-full h-56 object-cover" />
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] flex flex-col justify-center space-y-2 text-xs">
                <span className="font-bold text-[var(--brand-text-main)]">
                  SPOT FIX Priority Engine Breakdown
                </span>
                <div className="space-y-1 text-[var(--brand-text-secondary)]">
                  <div className="flex justify-between">
                    <span>Severity Weight:</span>
                    <span className="font-bold text-[var(--brand-text-main)]">+{report.priorityFactors?.severityWeight || 30} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Public Safety Hazard:</span>
                    <span className="font-bold text-[var(--brand-text-main)]">+{report.priorityFactors?.safetyImpact || 25} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Upvotes ({supportCount}):</span>
                    <span className="font-bold text-[var(--brand-text-main)]">+{report.priorityFactors?.communityReports || 15} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>School/Health Zone:</span>
                    <span className="font-bold text-[var(--brand-text-main)]">+{report.priorityFactors?.affectedPopulation || 10} pts</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Vision Analysis Box */}
          <div className="p-4 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-[var(--brand-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--brand-accent)]" />
              <span>Gemini Vision AI Analysis ({report.aiConfidence}% Confidence)</span>
            </div>
            <p className="text-xs text-[var(--brand-text-secondary)]">
              {report.aiDescription}
            </p>
          </div>

          {/* Description & Landmark */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[var(--brand-text-main)]">Detailed Description:</h4>
            <p className="text-[var(--brand-text-secondary)] bg-[var(--brand-surface)]/60 p-3 rounded-2xl border border-[var(--brand-border-subtle)]">
              {report.description}
            </p>
            {report.landmark && (
              <p className="text-[var(--brand-text-muted)] font-medium">
                <span className="font-bold text-[var(--brand-text-main)]">Landmark:</span> {report.landmark}
              </p>
            )}
          </div>

          {/* Community Support Upvote Bar */}
          <div className="p-4 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-[var(--brand-text-main)] block">
                {supportCount} Citizens Face This Issue
              </span>
              <span className="text-xs text-[var(--brand-text-secondary)]">
                Community support directly increases the SPOT FIX Priority Score.
              </span>
            </div>
            <button
              onClick={handleSupport}
              disabled={hasSupported}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all ${
                hasSupported
                  ? 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)]'
                  : 'bg-[var(--brand-card)] text-[var(--brand-primary)] border border-[var(--brand-border)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-fg)]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{hasSupported ? t.supported : t.supportButton}</span>
            </button>
          </div>

          {/* Authority Section (Editable if Authority Role) */}
          {currentRole === 'authority' && (
            <div className="p-5 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] space-y-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[var(--brand-primary)]" />
                <h4 className="font-bold text-sm text-[var(--brand-text-main)]">
                  Municipal Authority Management Console
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Update Report Status:
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-bold"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Assigned Department:
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Official Authority Note / Resolution Progress:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    placeholder="e.g. Work crew dispatched with asphalt patchwork truck..."
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveAuthorityUpdate}
                disabled={isSaving}
                className="w-full py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                {isSaving ? 'Saving Updates...' : 'Save Status & Officer Assignment'}
              </button>
            </div>
          )}

          {/* Interactive Report Lifecycle Timeline */}
          <div>
            <h4 className="font-extrabold text-sm text-[var(--brand-text-main)] mb-3">
              Report Lifecycle Timeline
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-[var(--brand-border)]">
              {report.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[var(--brand-primary)] ring-4 ring-[var(--brand-card)]" />
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[var(--brand-text-main)]">
                        {event.status}
                      </span>
                      <span className="text-[10px] text-[var(--brand-text-muted)]">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[var(--brand-text-secondary)] mt-0.5">
                      {event.message}
                    </p>
                    <span className="text-[10px] text-[var(--brand-text-muted)] font-medium">By: {event.updatedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
