import React, { useState } from 'react';
import { CivicReport } from '../types';
import { ShieldAlert, CheckCircle2, Clock, Filter, Eye, UserCheck, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import { Language, translations } from '../translations';
import { api } from '../services/api';

interface AuthorityDashboardProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  onReportUpdated: (updated: CivicReport) => void;
  lang: Language;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  reports,
  onSelectReport,
  onReportUpdated,
  lang,
}) => {
  const t = translations[lang];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'all' && r.issueType !== selectedCategory) return false;
    if (selectedPriority !== 'all' && r.priorityLevel !== selectedPriority) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.issueTitle.toLowerCase().includes(q) ||
        r.villageOrArea.toLowerCase().includes(q) ||
        (r.assignedDepartment && r.assignedDepartment.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalReports = reports.length;
  const criticalCount = reports.filter((r) => r.priorityLevel === 'CRITICAL' || r.priorityLevel === 'HIGH').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  const handleQuickStatusUpdate = async (reportId: string, newStatus: string) => {
    const updated = await api.updateReportStatus(reportId, { status: newStatus });
    onReportUpdated(updated);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] border border-[var(--brand-border-subtle)] font-bold text-xs mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Municipal Administration Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--brand-text-main)]">
            Civic Report <span className="font-bold text-[var(--brand-primary)]">Management & Dispatch</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] mt-1">
            Prioritize complaints based on SPOT FIX AI score, route to relevant departments, and post resolution updates.
          </p>
        </div>
      </div>

      {/* Authority Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider block">Total Complaints</span>
          <span className="text-3xl font-bold text-[var(--brand-text-main)] mt-1 block">{totalReports}</span>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Critical & High Priority</span>
          <span className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">{criticalCount}</span>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">Work In Progress</span>
          <span className="text-3xl font-bold text-sky-600 dark:text-sky-400 mt-1 block">{inProgressCount}</span>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-wider block">Issues Resolved</span>
          <span className="text-3xl font-bold text-[var(--brand-primary)] mt-1 block">{resolvedCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[var(--brand-surface)] p-3 rounded-full border border-[var(--brand-border)]">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--brand-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Report ID, Area, Officer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-main)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs px-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-semibold text-xs focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="pothole">{t.cat_pothole}</option>
            <option value="garbage">{t.cat_garbage}</option>
            <option value="broken_streetlight">{t.cat_broken_streetlight}</option>
            <option value="open_drain">{t.cat_open_drain}</option>
            <option value="water_leakage">{t.cat_water_leakage}</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-semibold text-xs focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-semibold text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Master Reports Table */}
      <div className="bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--brand-surface)] uppercase tracking-wider text-[var(--brand-text-muted)] font-bold border-b border-[var(--brand-border)] text-[10px]">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Issue Details</th>
                <th className="p-4">Location</th>
                <th className="p-4">Priority Score</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--brand-border-subtle)] font-medium text-[var(--brand-text-main)]">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-[var(--brand-surface)]/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-[var(--brand-primary)]">
                    {report.id}
                  </td>

                  <td className="p-4 max-w-xs">
                    <div className="font-bold text-[var(--brand-text-main)] truncate">
                      {report.issueTitle}
                    </div>
                    <div className="text-[11px] text-[var(--brand-text-muted)] capitalize">
                      {report.issueType.replace('_', ' ')} • 👍 {report.supportCount} Upvotes
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-[var(--brand-text-main)]">{report.villageOrArea}</div>
                    <div className="text-[11px] text-[var(--brand-text-muted)]">{report.district}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border ${
                        report.priorityLevel === 'CRITICAL'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                          : report.priorityLevel === 'HIGH'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                          : 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900'
                      }`}
                    >
                      Score {report.priorityScore} • {report.priorityLevel}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-[var(--brand-text-secondary)]">
                    {report.assignedDepartment || 'Unassigned'}
                  </td>

                  <td className="p-4">
                    <select
                      value={report.status}
                      onChange={(e) => handleQuickStatusUpdate(report.id, e.target.value)}
                      className="px-3 py-1.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-card)] font-bold text-[var(--brand-text-main)] text-xs focus:outline-none"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectReport(report)}
                      className="px-4 py-2 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-semibold transition-all text-xs cursor-pointer shadow-xs"
                    >
                      Manage & Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
