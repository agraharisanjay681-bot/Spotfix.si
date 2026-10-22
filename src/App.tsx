import React, { useEffect, useState } from 'react';
import { UserRole, CivicReport, CaseStudy, AppNotification } from './types';
import { Language } from './translations';
import { api } from './services/api';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { MapComponent } from './components/MapComponent';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { ContactSection } from './components/ContactSection';
import { ReportFlowModal } from './components/ReportFlowModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';
import { Palette } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [lang, setLang] = useState<Language>('en');
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);

  // Dynamic Theme state from Context
  const { isCustomizerOpen, setIsCustomizerOpen, activeThemeConfig } = useTheme();

  // Data states
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<CivicReport | null>(null);

  // Load initial data from API
  const loadInitialData = async () => {
    const fetchedReports = await api.getReports();
    setReports(fetchedReports);

    const fetchedCaseStudies = await api.getCaseStudies();
    setCaseStudies(fetchedCaseStudies);

    const fetchedNotifs = await api.getNotifications();
    setNotifications(fetchedNotifs);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleReportCreated = (newReport: CivicReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleSupportReport = async (reportId: string) => {
    const res = await api.supportReport(reportId);
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              supportCount: res.supportCount,
              priorityScore: res.priorityScore,
            }
          : r
      )
    );
  };

  const handleReportUpdated = (updatedReport: CivicReport) => {
    setReports((prev) => prev.map((r) => (r.id === updatedReport.id ? updatedReport : r)));
    if (selectedReportDetail?.id === updatedReport.id) {
      setSelectedReportDetail(updatedReport);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text-main)] flex flex-col font-sans transition-colors duration-200 selection:bg-[var(--brand-primary)] selection:text-[var(--brand-primary-fg)]">
      
      {/* Low-Bandwidth Indicator Bar */}
      {isLowBandwidth && (
        <div className="bg-[var(--brand-accent)] text-slate-950 text-center text-xs font-bold py-1 px-4 flex items-center justify-center space-x-2">
          <span>⚡ Low-Bandwidth Mode Active — Images & Map resolution optimized for 2G/3G networks</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'authority') setActiveTab('dashboard');
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onToggleLanguage={() => setLang(lang === 'en' ? 'hi' : 'en')}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        notifications={notifications}
        isLowBandwidth={isLowBandwidth}
        onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <LandingHero
              lang={lang}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onNavigateTab={setActiveTab}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* Map Preview on Home */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[var(--brand-text-main)]">
                      Live Community Map Preview
                    </h2>
                    <p className="text-xs text-[var(--brand-text-muted)]">
                      Color-coded civic reports across rural districts and municipal wards.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="text-xs font-bold text-[var(--brand-primary)] hover:underline"
                  >
                    Expand Full Map →
                  </button>
                </div>
                <MapComponent
                  reports={reports}
                  onSelectReport={(r) => setSelectedReportDetail(r)}
                  onSupportReport={handleSupportReport}
                  lang={lang}
                />
              </div>

              {/* Citizen Portal Cards Preview */}
              <CitizenDashboard
                reports={reports}
                onSelectReport={(r) => setSelectedReportDetail(r)}
                onSupportReport={handleSupportReport}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--brand-text-main)]">
                Live Community Issue Map
              </h2>
              <p className="text-xs sm:text-sm text-[var(--brand-text-muted)] mt-1">
                Explore open and resolved civic problems with color-coded severity markers (Red: Critical, Orange: High, Yellow: Medium, Green: Low).
              </p>
            </div>
            <MapComponent
              reports={reports}
              onSelectReport={(r) => setSelectedReportDetail(r)}
              onSupportReport={handleSupportReport}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentRole === 'authority' ? (
              <AuthorityDashboard
                reports={reports}
                onSelectReport={(r) => setSelectedReportDetail(r)}
                onReportUpdated={handleReportUpdated}
                lang={lang}
              />
            ) : (
              <CitizenDashboard
                reports={reports}
                onSelectReport={(r) => setSelectedReportDetail(r)}
                onSupportReport={handleSupportReport}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                lang={lang}
              />
            )}
          </div>
        )}

        {activeTab === 'case-studies' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CaseStudiesSection caseStudies={caseStudies} lang={lang} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ContactSection lang={lang} />
          </div>
        )}
      </main>

      {/* Floating Theme Customizer Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-[var(--brand-card)] text-[var(--brand-text-main)] border border-[var(--brand-border)] shadow-lg hover:border-[var(--brand-primary)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Dynamic Theme Studio"
        >
          <div className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center">
            <Palette className="w-3 h-3 group-hover:rotate-45 transition-transform" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">
            Theme: <span className="text-[var(--brand-primary)]">{activeThemeConfig.name.split(' ')[0]}</span>
          </span>
        </button>
      </div>

      {/* Floating Interactive AI Chatbot */}
      <ChatbotWidget />

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} lang={lang} />

      {/* 1-Click Reporting Modal */}
      <ReportFlowModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportCreated={handleReportCreated}
        lang={lang}
      />

      {/* Detailed Report & Authority Modal */}
      <ReportDetailModal
        report={selectedReportDetail}
        onClose={() => setSelectedReportDetail(null)}
        onReportUpdated={handleReportUpdated}
        currentRole={currentRole}
        lang={lang}
      />

      {/* Dynamic Theme Customizer Modal */}
      <ThemeCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
