import React from 'react';
import { Shield, Camera, Heart, Globe } from 'lucide-react';
import { Language, translations } from '../translations';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, lang }) => {
  const t = translations[lang];

  return (
    <footer className="bg-[var(--brand-card)] border-t border-[var(--brand-border)] py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigateTab('home')}>
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-[var(--brand-text-main)]">
                SPOT <span className="font-light text-[var(--brand-text-muted)]">FIX</span>
              </span>
            </div>
            <p className="text-xs font-bold text-[var(--brand-primary)]">
              "{t.tagline}"
            </p>
            <p className="text-xs text-[var(--brand-text-secondary)] max-w-sm leading-relaxed">
              SPOT FIX is an AI-powered civic issue detection & smart reporting platform built for rural citizens and municipal authorities to make public infrastructure safer, cleaner, and better prioritized.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[var(--brand-text-main)] text-[10px] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-[var(--brand-text-secondary)] font-medium">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-[var(--brand-primary)] transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('map')} className="hover:text-[var(--brand-primary)] transition-colors">
                  {t.navMap}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('dashboard')} className="hover:text-[var(--brand-primary)] transition-colors">
                  {t.navMyReports} & Portals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('case-studies')} className="hover:text-[var(--brand-primary)] transition-colors">
                  {t.navCaseStudies}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-[var(--brand-primary)] transition-colors">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Ethical Notice */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[var(--brand-text-main)] text-[10px] uppercase tracking-wider">
              Civic Disclaimer
            </h4>
            <p className="text-[11px] text-[var(--brand-text-muted)] leading-relaxed">
              SPOT FIX priority scores and AI vision analysis are automated decision-support recommendations to assist human municipal officers in field verification and rapid department routing.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-[var(--brand-border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--brand-text-muted)] gap-4">
          <p>© 2026 SPOT FIX Civic Platform. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with social impact for Rural Communities</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>

      </div>
    </footer>
  );
};
