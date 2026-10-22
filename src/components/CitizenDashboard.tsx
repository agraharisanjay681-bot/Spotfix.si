import React, { useState } from 'react';
import { CivicReport } from '../types';
import { ReportCard } from './ReportCard';
import { Camera, Search, Filter, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language, translations } from '../translations';

interface CitizenDashboardProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  onSupportReport: (id: string) => void;
  onOpenReportModal: () => void;
  lang: Language;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  reports,
  onSelectReport,
  onSupportReport,
  onOpenReportModal,
  lang,
}) => {
  const t = translations[lang];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'all' && r.issueType !== selectedCategory) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.issueTitle.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.villageOrArea.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
  const reviewCount = reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner & Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--brand-text-main)]">
            {t.navMyReports} <span className="font-bold text-[var(--brand-primary)]">& Community Portal</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] mt-1 font-normal">
            Track reported infrastructure damage, upvote local issues, and monitor village resolutions.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-6 py-3 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>{t.reportIssueBtn}</span>
        </button>
      </div>

      {/* Citizen Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--brand-text-main)] block">{totalCount}</span>
            <span className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider">Total Reports</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--brand-text-main)] block">{inProgressCount}</span>
            <span className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider">In Progress</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--brand-text-main)] block">{resolvedCount}</span>
            <span className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider">Resolved</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-primary)] flex items-center justify-center shrink-0 border border-[var(--brand-border-subtle)]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[var(--brand-text-main)] block">{reviewCount}</span>
            <span className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider">Under Review</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--brand-surface)] p-3 rounded-full border border-[var(--brand-border)]">
        
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--brand-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Title, Village..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-main)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs px-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-semibold text-xs focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="pothole">{t.cat_pothole}</option>
            <option value="garbage">{t.cat_garbage}</option>
            <option value="broken_streetlight">{t.cat_broken_streetlight}</option>
            <option value="open_drain">{t.cat_open_drain}</option>
            <option value="water_leakage">{t.cat_water_leakage}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-semibold text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">{t.status_submitted}</option>
            <option value="In Progress">{t.status_in_progress}</option>
            <option value="Resolved">{t.status_resolved}</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] space-y-3">
          <p className="text-base font-bold text-[var(--brand-text-main)]">No civic reports found</p>
          <p className="text-xs text-[var(--brand-text-secondary)]">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onSelect={onSelectReport}
              onSupport={onSupportReport}
              lang={lang}
            />
          ))}
        </div>
      )}

    </div>
  );
};
