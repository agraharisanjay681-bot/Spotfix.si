import React, { useState } from 'react';
import { CaseStudy } from '../types';
import { Award, Filter, ArrowUpRight, TrendingUp, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Language, translations } from '../translations';

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
  lang: Language;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  caseStudies,
  lang,
}) => {
  const t = translations[lang];

  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const categories = ['All', 'Infrastructure', 'Sanitation', 'Safety', 'Water'];

  const filteredCaseStudies = caseStudies.filter((cs) => {
    if (selectedFilter === 'All') return true;
    return cs.category === selectedFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] border border-[var(--brand-border-subtle)] font-bold text-xs">
          <Award className="w-4 h-4 text-[var(--brand-accent)]" />
          <span>SPOT FIX Civic Impact Portfolio</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[var(--brand-text-main)]">
          Real Impact <span className="font-bold text-[var(--brand-primary)]">Case Studies & Metrics</span>
        </h2>

        <p className="text-sm text-[var(--brand-text-secondary)] font-normal">
          Explore ground-level transformations achieved across rural Gram Panchayats and municipal wards through AI detection and citizen-driven reporting.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold shadow-xs'
                : 'bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)] hover:border-[var(--brand-primary)]'
            }`}
          >
            {cat === 'All' ? 'All Case Studies' : cat}
          </button>
        ))}
      </div>

      {/* Case Studies Cards Grid */}
      <div className="space-y-8">
        {filteredCaseStudies.map((cs) => (
          <div
            key={cs.id}
            className="bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] p-6 sm:p-8 space-y-6 shadow-xs"
          >
            
            {/* Title & Category Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[var(--brand-border-subtle)]">
              <div>
                <span className="px-3 py-1 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] font-bold text-[11px] uppercase tracking-wider mb-2 inline-block border border-[var(--brand-border-subtle)]">
                  {cs.category} • {cs.location}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--brand-text-main)]">
                  {cs.title}
                </h3>
                <p className="text-xs text-[var(--brand-text-muted)] mt-1">
                  Completed in {cs.completionDate}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 text-[var(--brand-primary)] font-bold text-xs bg-[var(--brand-surface)] px-3 py-1.5 rounded-full border border-[var(--brand-border-subtle)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
                <span>Verified Resolution</span>
              </div>
            </div>

            {/* Before vs After Visual Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-900/50 h-52 bg-gray-50 dark:bg-slate-800">
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                  BEFORE (Identified by SPOT FIX)
                </span>
                <img src={cs.beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[var(--brand-border)] h-52 bg-gray-50 dark:bg-slate-800">
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold text-[10px] uppercase tracking-wider shadow-xs">
                  AFTER (Resolved by Municipality)
                </span>
                <img src={cs.afterImageUrl} alt="After" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Narrative Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1">
                <span className="font-bold text-rose-600 uppercase tracking-wider block text-[10px]">
                  Problem & Citizen Report:
                </span>
                <p className="text-[var(--brand-text-secondary)]">
                  {cs.problemDescription}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] space-y-1">
                <span className="font-bold text-[var(--brand-primary)] uppercase tracking-wider block text-[10px]">
                  AI Prioritization & Solution:
                </span>
                <p className="text-[var(--brand-text-secondary)]">
                  {cs.solutionProvided}
                </p>
              </div>
            </div>

            {/* Project Impact Metrics Display */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-text-muted)] mb-3">
                Key Project Impact Metrics:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cs.impactMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[var(--brand-surface)]/60 border border-[var(--brand-border-subtle)] text-center space-y-1"
                  >
                    <span className="text-2xl font-bold text-[var(--brand-primary)] block">
                      {metric.value}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--brand-accent)] block">
                      {metric.change}
                    </span>
                    <span className="text-[10px] text-[var(--brand-text-muted)] font-medium block">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
