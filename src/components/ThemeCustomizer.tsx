import React from 'react';
import { X, Check, Palette, Sparkles, Sun, Moon, RefreshCw, Zap, TrendingUp, Layers } from 'lucide-react';
import { useTheme, AVAILABLE_THEMES, ThemeId } from '../context/ThemeContext';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_PRESETS = [
  { name: 'Ascent Gold', hex: '#f59e0b' },
  { name: 'Vibrant Turquoise', hex: '#14b8a6' },
  { name: 'Solar Orange', hex: '#ea580c' },
  { name: 'Electric Violet', hex: '#8b5cf6' },
  { name: 'Rose Red', hex: '#f43f5e' },
  { name: 'Sky Cyan', hex: '#0284c7' },
  { name: 'Emerald Jade', hex: '#10b981' },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    darkMode,
    toggleDarkMode,
    setDarkMode,
    customAccent,
    setCustomAccent,
    activeThemeConfig,
  } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-10 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800/80 bg-gray-50/80 dark:bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Dynamic Theme Engine
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[var(--brand-accent)] text-[var(--brand-accent-fg)]">
                  Live Customizer
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Switch visual identities, customize accents, or toggle light & dark modes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Featured Banner: Ascent Theme */}
          <div className="relative rounded-2xl p-4 bg-gradient-to-r from-teal-900/10 via-teal-800/5 to-amber-500/10 dark:from-teal-950/40 dark:to-amber-950/20 border border-teal-500/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shrink-0 border border-teal-200 dark:border-teal-800/60 shadow-xs flex items-center justify-center p-1">
              <img
                src="/theme-ascent-hero.png"
                alt="Ascent Artwork"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-teal-200 dark:border-teal-800">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Uploaded Reference Theme</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Ascent (Teal & Golden Amber)
              </h4>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Directly translated from your reference artwork: collaborative ascending arrows, teal architectural steps, and radiant golden lightbulb highlights.
              </p>
            </div>
            <button
              onClick={() => {
                setTheme('ascent');
                setCustomAccent(null);
              }}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                theme === 'ascent'
                  ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400'
                  : 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700 hover:bg-teal-50'
              }`}
            >
              {theme === 'ascent' ? '✓ Active Theme' : 'Apply Ascent'}
            </button>
          </div>

          {/* Theme Palette Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                Select Theme Palette
              </label>
              <span className="text-[11px] text-gray-500 dark:text-slate-400">
                {AVAILABLE_THEMES.length} Presets Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-surface)]/60 shadow-md ring-2 ring-[var(--brand-primary)]/20'
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">
                            {t.name}
                          </span>
                          {t.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                              {t.badge}
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1 mb-3">
                        {t.subtitle}
                      </p>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center space-x-1.5 pt-2 border-t border-gray-100 dark:border-slate-800/80">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: t.previewColors.primary }}
                        title="Primary"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: t.previewColors.secondary }}
                        title="Secondary"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: t.previewColors.accent }}
                        title="Accent"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs ml-auto"
                        style={{ backgroundColor: t.previewColors.bg }}
                        title="Background"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Switcher: Light / Dark */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
              Display Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all cursor-pointer ${
                  !darkMode
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-surface)] text-[var(--brand-primary)] shadow-xs ring-1 ring-[var(--brand-primary)]/20'
                    : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => setDarkMode(true)}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all cursor-pointer ${
                  darkMode
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-surface)] text-[var(--brand-primary)] shadow-xs ring-1 ring-[var(--brand-primary)]/20'
                    : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-teal-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Dynamic Accent Color Tuning */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                Dynamic Accent Spark
              </label>
              {customAccent && (
                <button
                  onClick={() => setCustomAccent(null)}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {ACCENT_PRESETS.map((p) => {
                const isActive = (customAccent || activeThemeConfig.previewColors.accent).toLowerCase() === p.hex.toLowerCase();
                return (
                  <button
                    key={p.hex}
                    onClick={() => setCustomAccent(p.hex)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isActive
                        ? 'border-gray-900 dark:border-white shadow-xs font-bold scale-105'
                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span className="text-[11px] text-gray-700 dark:text-slate-300">
                      {p.name}
                    </span>
                  </button>
                );
              })}

              {/* Custom Color Input */}
              <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-gray-300 dark:border-slate-700 hover:border-gray-500 cursor-pointer">
                <input
                  type="color"
                  value={customAccent || activeThemeConfig.previewColors.accent}
                  onChange={(e) => setCustomAccent(e.target.value)}
                  className="w-4 h-4 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                />
                <span className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold">
                  Custom Hex
                </span>
              </label>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-bg)] space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--brand-text-muted)]">
              Live Interactive Theme Preview
            </span>

            <div className="p-4 rounded-xl bg-[var(--brand-card)] border border-[var(--brand-border)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center font-bold text-xs">
                    SF
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-text-main)]">
                    SPOT.FIX Preview Component
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--brand-accent)] text-[var(--brand-accent-fg)]">
                  Active Highlight
                </span>
              </div>

              <p className="text-xs text-[var(--brand-text-secondary)] leading-relaxed">
                This is a live reflection of typography, surfaces, buttons, and accents under the <span className="font-bold underline decoration-[var(--brand-accent)]">{activeThemeConfig.name}</span>.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] shadow-xs">
                  Primary Action
                </button>
                <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--brand-surface)] text-[var(--brand-text-main)] border border-[var(--brand-border)]">
                  Secondary Pill
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <p className="text-[11px] text-gray-500 dark:text-slate-400">
            Selected: <strong className="text-gray-900 dark:text-white">{activeThemeConfig.name}</strong> • {darkMode ? 'Dark' : 'Light'} Mode
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
