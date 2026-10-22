import React, { useState, useRef, useEffect } from 'react';
import { Shield, Camera, MapPin, BarChart3, BookOpen, Mail, Sun, Moon, Languages, Bell, UserCheck, Wifi, WifiOff, Palette, ChevronDown, Check, Sparkles } from 'lucide-react';
import { UserRole, AppNotification } from '../types';
import { Language, translations } from '../translations';
import { useTheme, AVAILABLE_THEMES } from '../context/ThemeContext';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onToggleLanguage: () => void;
  onOpenReportModal: () => void;
  notifications: AppNotification[];
  isLowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  lang,
  onToggleLanguage,
  onOpenReportModal,
  notifications,
  isLowBandwidth,
  onToggleLowBandwidth,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme, darkMode, toggleDarkMode, activeThemeConfig, setIsCustomizerOpen } = useTheme();
  const t = translations[lang];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--brand-card)]/90 border-b border-[var(--brand-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={() => onTabChange('home')}>
            <div className="w-10 h-10 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-[var(--brand-text-main)] uppercase">
                  SPOT<span className="text-[var(--brand-text-muted)] font-light">.FIX</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[var(--brand-surface)] text-[var(--brand-primary)] border border-[var(--brand-border-subtle)]">
                  CIVIC AI
                </span>
              </div>
              <p className="text-[11px] text-[var(--brand-text-muted)] font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <button
              onClick={() => onTabChange('home')}
              className={`transition-colors pb-1 ${
                activeTab === 'home'
                  ? 'text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)]'
                  : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => onTabChange('map')}
              className={`flex items-center space-x-1.5 transition-colors pb-1 ${
                activeTab === 'map'
                  ? 'text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)]'
                  : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>{t.navMap}</span>
            </button>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-1.5 transition-colors pb-1 ${
                activeTab === 'dashboard'
                  ? 'text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)]'
                  : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>{currentRole === 'authority' ? t.navAuthority : t.navMyReports}</span>
            </button>
            <button
              onClick={() => onTabChange('case-studies')}
              className={`flex items-center space-x-1.5 transition-colors pb-1 ${
                activeTab === 'case-studies'
                  ? 'text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)]'
                  : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>{t.navCaseStudies}</span>
            </button>
            <button
              onClick={() => onTabChange('contact')}
              className={`flex items-center space-x-1.5 transition-colors pb-1 ${
                activeTab === 'contact'
                  ? 'text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)]'
                  : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
              }`}
            >
              <Mail className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>{t.navContact}</span>
            </button>
          </nav>

          {/* Controls: Theme Switcher, Role, Low-Bandwidth, Language, Dark Mode, Report CTA */}
          <div className="flex items-center space-x-2.5">
            
            {/* Dynamic Theme Picker Dropdown & Modal Trigger */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[var(--brand-surface)] border border-[var(--brand-border)] text-xs font-semibold text-[var(--brand-text-main)] hover:border-[var(--brand-primary)] transition-all cursor-pointer shadow-xs"
                title="Select Theme & Palette"
              >
                <div className="flex items-center -space-x-1">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: activeThemeConfig.previewColors.primary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: activeThemeConfig.previewColors.accent }}
                  />
                </div>
                <span className="hidden sm:inline font-bold">
                  {theme === 'ascent' ? 'Ascent Teal' : activeThemeConfig.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--brand-text-muted)]" />
              </button>

              {/* Theme Dropdown Menu */}
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--brand-card)] rounded-2xl shadow-2xl border border-[var(--brand-border)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--brand-border-subtle)] px-2">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--brand-text-muted)]">
                      Dynamic Theme
                    </span>
                    <button
                      onClick={() => {
                        setShowThemeMenu(false);
                        setIsCustomizerOpen(true);
                      }}
                      className="text-[11px] font-bold text-[var(--brand-primary)] hover:underline flex items-center space-x-1"
                    >
                      <Palette className="w-3 h-3" />
                      <span>Customizer</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    {AVAILABLE_THEMES.map((t) => {
                      const isSelected = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[var(--brand-surface)] text-[var(--brand-primary)] font-bold'
                              : 'text-[var(--brand-text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="flex items-center -space-x-1">
                              <span
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: t.previewColors.primary }}
                              />
                              <span
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: t.previewColors.accent }}
                              />
                            </div>
                            <span className="text-xs">{t.name}</span>
                          </div>

                          {isSelected && <Check className="w-3.5 h-3.5 text-[var(--brand-primary)]" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[var(--brand-border-subtle)]">
                    <button
                      onClick={() => {
                        setShowThemeMenu(false);
                        setIsCustomizerOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open Theme Studio</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <div className="hidden md:flex items-center bg-[var(--brand-surface)] p-1 rounded-full text-xs font-medium border border-[var(--brand-border-subtle)]">
              <button
                onClick={() => onRoleChange('citizen')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currentRole === 'citizen'
                    ? 'bg-[var(--brand-card)] text-[var(--brand-primary)] font-bold shadow-xs'
                    : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
                }`}
              >
                {t.roleCitizen}
              </button>
              <button
                onClick={() => onRoleChange('authority')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currentRole === 'authority'
                    ? 'bg-[var(--brand-card)] text-[var(--brand-primary)] font-bold shadow-xs'
                    : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
                }`}
              >
                {t.roleAuthority}
              </button>
              <button
                onClick={() => onRoleChange('ngo')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currentRole === 'ngo'
                    ? 'bg-[var(--brand-card)] text-[var(--brand-primary)] font-bold shadow-xs'
                    : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
                }`}
              >
                {t.roleNgo}
              </button>
            </div>

            {/* Utility Controls Group */}
            <div className="flex items-center bg-[var(--brand-surface)] p-1 rounded-full space-x-1 border border-[var(--brand-border-subtle)]">
              {/* Low Bandwidth Toggle */}
              <button
                onClick={onToggleLowBandwidth}
                title={isLowBandwidth ? 'Low-Bandwidth Mode ON (Optimized for 2G/3G)' : 'Normal Mode'}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  isLowBandwidth
                    ? 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)]'
                    : 'text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)]'
                }`}
              >
                {isLowBandwidth ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              </button>

              {/* Language Switcher */}
              <button
                onClick={onToggleLanguage}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[11px] font-bold text-[var(--brand-text-main)] hover:text-[var(--brand-primary)] transition-colors"
                title="Toggle English / Hindi"
              >
                <span>{lang === 'en' ? 'HI' : 'EN'}</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--brand-text-secondary)] hover:text-[var(--brand-text-main)] transition-colors"
                title="Toggle Dark/Light Mode"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-text-main)] hover:bg-[var(--brand-surface)] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand-accent)]" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 bg-[var(--brand-card)] rounded-3xl shadow-2xl border border-[var(--brand-border)] p-5 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--brand-border)] mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-[var(--brand-text-main)]">Notifications</span>
                    <span className="text-[10px] bg-[var(--brand-surface)] px-2 py-0.5 rounded-full font-bold text-[var(--brand-primary)]">
                      {notifications.length} Total
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[var(--brand-text-muted)] py-4 text-center">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-2xl bg-[var(--brand-surface)] text-xs">
                          <p className="font-bold text-[var(--brand-text-main)]">{n.title}</p>
                          <p className="text-[var(--brand-text-secondary)] mt-1 leading-relaxed text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 1-Click Primary Action */}
            <button
              onClick={onOpenReportModal}
              className="px-5 py-2.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t.reportIssueBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
