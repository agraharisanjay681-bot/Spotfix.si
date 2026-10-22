import React, { useState } from 'react';
import { CivicReport } from '../types';
import { MapPin, ThumbsUp, ArrowRight, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Language, translations } from '../translations';

interface ReportCardProps {
  report: CivicReport;
  onSelect: (report: CivicReport) => void;
  onSupport: (id: string) => void;
  lang: Language;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onSelect,
  onSupport,
  lang,
}) => {
  const t = translations[lang];
  const [hasSupported, setHasSupported] = useState(false);

  const handleSupportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasSupported) {
      setHasSupported(true);
      onSupport(report.id);
    }
  };

  const getPriorityStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'MEDIUM':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-900';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 border-gray-200 dark:border-slate-700';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)]';
      case 'In Progress':
        return 'bg-sky-600 text-white';
      case 'Assigned':
        return 'bg-[var(--brand-surface)] text-[var(--brand-text-main)] border border-[var(--brand-border)]';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-slate-800 dark:text-gray-300';
    }
  };

  return (
    <div
      onClick={() => onSelect(report)}
      className="group bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] overflow-hidden hover:border-[var(--brand-primary)] shadow-xs hover:shadow-theme transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Image Banner & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-slate-800">
        <img
          src={report.imageUrl}
          alt={report.issueTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Pill Top Right */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${getStatusStyle(report.status)}`}>
            {report.status}
          </span>
        </div>

        {/* Priority Badge Top Left */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border shadow-xs ${getPriorityStyle(report.priorityLevel)}`}>
            Score {report.priorityScore} • {report.priorityLevel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-widest mb-1.5">
            <span>{report.issueType.replace('_', ' ')}</span>
            <span>•</span>
            <span className="font-mono">{report.id}</span>
          </div>

          <h3 className="font-bold text-base text-[var(--brand-text-main)] line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">
            {report.issueTitle}
          </h3>

          <p className="text-xs text-[var(--brand-text-secondary)] line-clamp-2 mt-1 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Location & Support Counter */}
        <div className="pt-3 border-t border-[var(--brand-border-subtle)] space-y-3">
          <div className="flex items-center text-xs text-[var(--brand-text-secondary)] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[var(--brand-primary)] mr-1.5 shrink-0" />
            <span className="truncate">{report.locationName} ({report.villageOrArea})</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleSupportClick}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                hasSupported
                  ? 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold shadow-xs'
                  : 'bg-[var(--brand-surface)] text-[var(--brand-text-main)] hover:bg-[var(--brand-border)]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{report.supportCount} Affected</span>
            </button>

            <span className="text-xs font-bold text-[var(--brand-primary)] flex items-center group-hover:translate-x-0.5 transition-transform">
              <span>{t.trackReport}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
