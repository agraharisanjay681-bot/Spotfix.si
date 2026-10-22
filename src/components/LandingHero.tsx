import React from 'react';
import { Camera, Shield, Zap, Sparkles, MapPin, ArrowRight, CheckCircle2, Award, Users, AlertTriangle, Eye, Check, Lightbulb, TrendingUp, Palette } from 'lucide-react';
import { Language, translations } from '../translations';
import { useTheme } from '../context/ThemeContext';

interface LandingHeroProps {
  lang: Language;
  onOpenReportModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  lang,
  onOpenReportModal,
  onNavigateTab,
}) => {
  const t = translations[lang];
  const { theme, setIsCustomizerOpen, activeThemeConfig } = useTheme();

  return (
    <div className="relative overflow-hidden bg-[var(--brand-bg)] pt-8 pb-16 transition-colors duration-200">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[var(--brand-surface)]/60 to-transparent pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Dynamic Theme Banner Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--brand-accent)' }}
            />
            <span className="text-xs font-semibold text-[var(--brand-text-secondary)]">
              Dynamic Palette: <strong className="text-[var(--brand-text-main)]">{activeThemeConfig.name}</strong>
            </span>
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="text-[11px] font-bold text-[var(--brand-primary)] hover:underline flex items-center space-x-1 pl-1 border-l border-[var(--brand-border-subtle)]"
            >
              <Palette className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] text-xs font-bold uppercase tracking-wider border border-[var(--brand-border-subtle)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
            <span>AI-Powered Civic Issue Detection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[var(--brand-text-main)] leading-none">
            SPOT<span className="font-extrabold text-[var(--brand-primary)]">.FIX</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-[var(--brand-text-secondary)] tracking-tight">
            "{t.tagline}"
          </p>

          <p className="text-[var(--brand-text-secondary)] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Empowering rural & urban citizens to report public infrastructure damage in seconds using Gemini Vision AI. Intelligently prioritized and resolved with municipal authorities.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onOpenReportModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t.reportIssueBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('map')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[var(--brand-surface)] hover:bg-[var(--brand-border)] text-[var(--brand-text-main)] font-semibold text-sm flex items-center justify-center space-x-2 border border-[var(--brand-border-subtle)] transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>{t.exploreMapBtn}</span>
            </button>

            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[var(--brand-card)] hover:bg-[var(--brand-surface)] text-[var(--brand-text-secondary)] font-medium text-xs flex items-center justify-center space-x-2 border border-[var(--brand-border)] transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[var(--brand-accent)]" />
              <span>Customize Theme</span>
            </button>
          </div>
        </div>

        {/* Featured Ascent Collaborative Engine Showcase */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-theme relative overflow-hidden transition-all duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Artwork Showcase */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-square sm:aspect-4/3 rounded-2xl bg-gradient-to-b from-teal-500/5 to-amber-500/5 dark:from-teal-900/20 dark:to-amber-900/10 flex items-center justify-center p-4 border border-[var(--brand-border-subtle)]">
                <img
                  src="/theme-ascent-hero.png"
                  alt="Civic Ascent & Collaborative Growth Engine"
                  className="w-full h-full object-contain filter drop-shadow-md hover:scale-[1.02] transition-transform duration-300"
                />

                {/* Micro Float Badge 1: Lightbulb */}
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-amber-200 dark:border-amber-900/50 flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 fill-amber-950" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 dark:text-amber-200">
                    AI Vision Summit
                  </span>
                </div>

                {/* Micro Float Badge 2: Upward Momentum */}
                <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-teal-200 dark:border-teal-900/50 flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 dark:text-teal-200">
                    Municipal Escalation
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Synergy Points */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] text-[11px] font-bold uppercase tracking-wider border border-[var(--brand-border-subtle)]">
                <Users className="w-3.5 h-3.5" />
                <span>The Civic Ascent Engine</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brand-text-main)] tracking-tight leading-snug">
                From Community Discovery to Rapid Municipal Resolution
              </h2>

              <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] leading-relaxed">
                Like the ascending steps in the artwork above, civic infrastructure problems are solved when citizens, AI detection, and municipal teams climb together in harmony.
              </p>

              {/* 3 Step Features */}
              <div className="space-y-3 pt-1">
                
                <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-[var(--brand-surface)]/50 border border-[var(--brand-border-subtle)]">
                  <div className="w-8 h-8 rounded-xl bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--brand-text-main)]">
                      Citizens Spot & Snap Photos
                    </h4>
                    <p className="text-[11px] text-[var(--brand-text-secondary)] mt-0.5">
                      Potholes, broken lights, and open drains are captured in seconds with automated GPS tags.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-[var(--brand-surface)]/50 border border-[var(--brand-border-subtle)]">
                  <div className="w-8 h-8 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--brand-text-main)]">
                      AI Prioritizes & Community Upvotes
                    </h4>
                    <p className="text-[11px] text-[var(--brand-text-secondary)] mt-0.5">
                      Gemini estimates severity, factors population risk, and prevents duplicate report spam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-[var(--brand-surface)]/50 border border-[var(--brand-border-subtle)]">
                  <div className="w-8 h-8 rounded-xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-primary)] flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--brand-text-main)]">
                      Authorities Dispatched & Resolved
                    </h4>
                    <p className="text-[11px] text-[var(--brand-text-secondary)] mt-0.5">
                      Panchayats and municipal officers verify, assign repair crews, and sign off transparently.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Workflow Showcase Grid */}
        <div className="mt-12 bg-[var(--brand-surface)] rounded-3xl p-8 border border-[var(--brand-border)]">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-text-muted)]">
              The SPOT FIX Workflow
            </h2>
            <p className="text-2xl font-light text-[var(--brand-text-main)] mt-1">
              Detect → Report → Prioritize → Resolve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 01 */}
            <div className="p-6 rounded-2xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs relative group hover:border-[var(--brand-primary)] transition-all">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] font-bold flex items-center justify-center mb-4 text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-[var(--brand-text-main)] mb-2 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[var(--brand-primary)]" />
                <span>Spot It</span>
              </h3>
              <p className="text-xs text-[var(--brand-text-secondary)] leading-relaxed">
                Notice a pothole, open drain, garbage dump, or broken streetlight in your village or ward.
              </p>
            </div>

            {/* Step 02 */}
            <div className="p-6 rounded-2xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs relative group hover:border-[var(--brand-primary)] transition-all">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] font-bold flex items-center justify-center mb-4 text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-[var(--brand-text-main)] mb-2 flex items-center space-x-2">
                <Camera className="w-4 h-4 text-[var(--brand-primary)]" />
                <span>Snap It</span>
              </h3>
              <p className="text-xs text-[var(--brand-text-secondary)] leading-relaxed">
                Take a photo directly from your smartphone. Works on 2G/3G networks with offline draft saving.
              </p>
            </div>

            {/* Step 03 */}
            <div className="p-6 rounded-2xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs relative group hover:border-[var(--brand-primary)] transition-all">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] font-bold flex items-center justify-center mb-4 text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-[var(--brand-text-main)] mb-2 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[var(--brand-accent)]" />
                <span>AI Detects It</span>
              </h3>
              <p className="text-xs text-[var(--brand-text-secondary)] leading-relaxed">
                Gemini Vision AI classifies the issue type, estimates severity, and calculates a priority score (0-100).
              </p>
            </div>

            {/* Step 04 */}
            <div className="p-6 rounded-2xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-xs relative group hover:border-[var(--brand-primary)] transition-all">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] font-bold flex items-center justify-center mb-4 text-xs">
                04
              </div>
              <h3 className="text-base font-bold text-[var(--brand-text-main)] mb-2 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
                <span>Solve It</span>
              </h3>
              <p className="text-xs text-[var(--brand-text-secondary)] leading-relaxed">
                Municipal teams receive instant routing, dispatch repair crews, and upload proof of resolution.
              </p>
            </div>

          </div>
        </div>

        {/* Live System Stats Banner */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-center shadow-xs">
            <div className="text-3xl font-light text-[var(--brand-text-main)]">1,480+</div>
            <div className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider mt-1">Issues Reported</div>
          </div>
          <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-center shadow-xs">
            <div className="text-3xl font-light text-[var(--brand-primary)] font-bold">92.4%</div>
            <div className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider mt-1">AI Detection Accuracy</div>
          </div>
          <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-center shadow-xs">
            <div className="text-3xl font-light text-[var(--brand-text-main)]">36 Hrs</div>
            <div className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider mt-1">Avg Resolution Time</div>
          </div>
          <div className="p-6 rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-center shadow-xs">
            <div className="text-3xl font-light text-[var(--brand-accent)] font-bold">42</div>
            <div className="text-[10px] font-bold text-[var(--brand-text-muted)] uppercase tracking-wider mt-1">Gram Panchayats Active</div>
          </div>
        </div>

      </div>
    </div>
  );
};
