import React, { useState } from 'react';
import { X, Camera, Upload, Sparkles, MapPin, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, ThumbsUp } from 'lucide-react';
import { IssueCategory, SeverityLevel, CivicReport } from '../types';
import { Language, translations } from '../translations';
import { api } from '../services/api';

interface ReportFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: CivicReport) => void;
  lang: Language;
}

// Preset samples for fast demo testing
const SAMPLE_PHOTOS = [
  {
    label: 'Pothole (School Zone)',
    category: 'pothole' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Garbage Dump',
    category: 'garbage' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Broken Streetlight',
    category: 'broken_streetlight' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Open Drain Pit',
    category: 'open_drain' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
  },
];

export const ReportFlowModal: React.FC<ReportFlowModalProps> = ({
  isOpen,
  onClose,
  onReportCreated,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  // Steps: 1: Photo -> 2: AI Vision -> 3: Location -> 4: Details -> 5: Complete
  const [step, setStep] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // AI analysis result state
  const [issueType, setIssueType] = useState<IssueCategory>('pothole');
  const [issueTitle, setIssueTitle] = useState<string>('');
  const [aiConfidence, setAiConfidence] = useState<number>(92);
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [aiDescription, setAiDescription] = useState<string>('');
  
  // Location state
  const [latitude, setLatitude] = useState<number>(25.3176);
  const [longitude, setLongitude] = useState<number>(82.9739);
  const [villageOrArea, setVillageOrArea] = useState<string>('Rampur');
  const [district, setDistrict] = useState<string>('Varanasi');
  const [locationName, setLocationName] = useState<string>('Near Primary Health Center');
  const [landmark, setLandmark] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdReport, setCreatedReport] = useState<CivicReport | null>(null);

  // Handle image upload / selection
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    triggerAiAnalysis(imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        triggerAiAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiAnalysis = async (imgData: string) => {
    setIsAnalyzing(true);
    setStep(2);
    try {
      const { analysis } = await api.analyzeImage(imgData);
      setIssueType(analysis.issueType || 'pothole');
      setIssueTitle(analysis.issueTitle || 'Civic Infrastructure Hazard');
      setAiConfidence(analysis.confidence || 90);
      setSeverity(analysis.severity || 'high');
      setAiDescription(analysis.description || 'AI detected photographic structural hazard.');
    } catch {
      setIssueType('pothole');
      setIssueTitle('Pothole Hazard');
      setAiConfidence(91);
      setSeverity('high');
      setAiDescription('Pothole detected on road surface.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Location detection
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationName(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          alert('GPS location permission denied or unavailable. Using default Village location.');
        }
      );
    }
  };

  // Move to Step 3 Location & Check Duplicate
  const handleProceedToLocation = async () => {
    setStep(3);
    const dupResult = await api.checkDuplicate(latitude, longitude, issueType);
    if (dupResult.hasDuplicate) {
      setDuplicateWarning(dupResult);
    } else {
      setDuplicateWarning(null);
    }
  };

  // Final submit
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      const newReport = await api.createReport({
        issueType,
        issueTitle: issueTitle || `${issueType.toUpperCase()} Report`,
        description: description || aiDescription,
        imageUrl: selectedImage || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        latitude,
        longitude,
        locationName,
        landmark,
        villageOrArea,
        district,
        aiConfidence,
        aiDescription,
        detectedSeverity: severity,
      });

      setCreatedReport(newReport);
      onReportCreated(newReport);
      setStep(5);
    } catch {
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-[var(--brand-card)] rounded-3xl max-w-2xl w-full border border-[var(--brand-border)] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-border-subtle)] bg-[var(--brand-surface)]">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold flex items-center justify-center text-xs shadow-xs">
              SF
            </span>
            <div>
              <h3 className="font-bold text-base text-[var(--brand-text-main)]">
                SPOT FIX — 1-Click Reporting
              </h3>
              <p className="text-xs text-[var(--brand-text-muted)]">
                AI Vision + Smart Prioritization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--brand-text-muted)] hover:text-[var(--brand-text-main)] hover:bg-[var(--brand-surface)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-6 py-3 bg-[var(--brand-surface)]/60 border-b border-[var(--brand-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--brand-text-muted)]">
          <span className={step >= 1 ? 'text-[var(--brand-primary)] font-bold' : ''}>{t.step1Photo}</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-[var(--brand-primary)] font-bold' : ''}>{t.step2AI}</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-[var(--brand-primary)] font-bold' : ''}>{t.step3Location}</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-[var(--brand-primary)] font-bold' : ''}>{t.step4Details}</span>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: CAPTURE OR UPLOAD PHOTO */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-[var(--brand-text-main)]">
                  Take or Upload Issue Photo
                </h4>
                <p className="text-xs text-[var(--brand-text-secondary)] mt-1">
                  Snap a clear photo of the damaged infrastructure. AI will automatically inspect it.
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-[var(--brand-primary)]/40 rounded-3xl p-8 text-center bg-[var(--brand-surface)]/40 hover:bg-[var(--brand-surface)]/70 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-center mx-auto mb-3 shadow-theme">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="font-bold text-[var(--brand-text-main)] text-sm">
                  Click to Take Photo or Choose File
                </p>
                <p className="text-xs text-[var(--brand-text-muted)] mt-1">
                  Supports JPG, PNG, WebP up to 15MB
                </p>
              </div>

              {/* Preset Sample Images for Fast Demo */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-text-muted)] mb-2">
                  Or select a sample photo for instant demo:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleImageSelect(sample.url)}
                      className="group p-2 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-left hover:border-[var(--brand-primary)] transition-all cursor-pointer"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-full h-20 object-cover rounded-lg mb-1 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[11px] font-semibold text-[var(--brand-text-main)] block truncate">
                        {sample.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GEMINI VISION AI ANALYSIS */}
          {step === 2 && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--brand-primary)] border-t-transparent animate-spin mx-auto" />
                  <p className="font-bold text-[var(--brand-text-main)] text-base">
                    {t.aiAnalyzing}
                  </p>
                  <p className="text-xs text-[var(--brand-text-muted)]">
                    Inspecting hazard features, calculating priority score...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)]">
                    <Sparkles className="w-6 h-6 text-[var(--brand-primary)] shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-[var(--brand-text-main)]">
                        Gemini Vision AI Analysis Completed
                      </p>
                      <p className="text-xs text-[var(--brand-text-secondary)]">
                        {t.aiConfidence}: <span className="font-extrabold text-[var(--brand-primary)]">{aiConfidence}%</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl overflow-hidden border border-[var(--brand-border)] max-h-48">
                      <img src={selectedImage} alt="Selected Issue" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                          Detected Category:
                        </label>
                        <select
                          value={issueType}
                          onChange={(e) => setIssueType(e.target.value as IssueCategory)}
                          className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] font-bold text-[var(--brand-text-main)]"
                        >
                          <option value="pothole">{t.cat_pothole}</option>
                          <option value="road_damage">{t.cat_road_damage}</option>
                          <option value="garbage">{t.cat_garbage}</option>
                          <option value="broken_streetlight">{t.cat_broken_streetlight}</option>
                          <option value="open_drain">{t.cat_open_drain}</option>
                          <option value="water_leakage">{t.cat_water_leakage}</option>
                          <option value="damaged_property">{t.cat_damaged_property}</option>
                          <option value="unsafe_road">{t.cat_unsafe_road}</option>
                          <option value="other">{t.cat_other}</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                          Estimated Severity:
                        </label>
                        <div className="flex space-x-2">
                          {(['low', 'medium', 'high'] as SeverityLevel[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => setSeverity(s)}
                              className={`flex-1 py-1.5 rounded-xl font-bold uppercase transition-all ${
                                severity === s
                                  ? s === 'high'
                                    ? 'bg-rose-600 text-white shadow-md'
                                    : s === 'medium'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] shadow-md'
                                  : 'bg-[var(--brand-surface)] text-[var(--brand-text-secondary)]'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                          Issue Title:
                        </label>
                        <input
                          type="text"
                          value={issueTitle}
                          onChange={(e) => setIssueTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--brand-surface)]/60 border border-[var(--brand-border-subtle)]">
                    <p className="text-xs text-[var(--brand-text-secondary)]">
                      <span className="font-bold text-[var(--brand-text-main)]">AI Note:</span> {aiDescription}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl text-[var(--brand-text-secondary)] hover:bg-[var(--brand-surface)] text-xs font-bold"
                    >
                      ← Re-take Photo
                    </button>
                    <button
                      onClick={handleProceedToLocation}
                      className="px-6 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                    >
                      <span>Confirm & Add Location</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: LOCATION & DUPLICATE CHECK */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-[var(--brand-text-main)]">
                    Confirm Incident Location
                  </h4>
                  <p className="text-xs text-[var(--brand-text-secondary)]">
                    Pin accurate location so municipal teams can reach the spot quickly.
                  </p>
                </div>
                <button
                  onClick={handleDetectGPS}
                  className="px-3 py-1.5 rounded-xl bg-[var(--brand-surface)] text-[var(--brand-primary)] border border-[var(--brand-border)] font-bold text-xs flex items-center space-x-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Use GPS Location</span>
                </button>
              </div>

              {/* Duplicate Warning Box if duplicate exists */}
              {duplicateWarning && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                        {t.duplicateWarningTitle}
                      </h5>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                        {duplicateWarning.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={async () => {
                        await api.supportReport(duplicateWarning.duplicateReport.id);
                        alert(`Thank you! You supported existing report ${duplicateWarning.duplicateReport.id}. Priority boosted!`);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{t.supportExistingBtn}</span>
                    </button>
                    <button
                      onClick={() => setDuplicateWarning(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--brand-card)] border border-[var(--brand-border)] text-[var(--brand-text-secondary)] font-bold text-xs"
                    >
                      {t.continueAnywayBtn}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Village / Area:
                  </label>
                  <input
                    type="text"
                    value={villageOrArea}
                    onChange={(e) => setVillageOrArea(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    District:
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Street / Location Name:
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[var(--brand-text-main)] block mb-1">
                    Landmark (Optional):
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    placeholder="e.g. Near Primary School Gate / Opposite Panchayat Bhavan"
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-[var(--brand-text-secondary)] hover:bg-[var(--brand-surface)] text-xs font-bold"
                >
                  ← Back to AI Result
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Next: Additional Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADDITIONAL DETAILS & SUBMIT */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-lg font-bold text-[var(--brand-text-main)]">
                  Additional Details & Confirmation
                </h4>
                <p className="text-xs text-[var(--brand-text-secondary)]">
                  Provide optional comments before generating your official report ID.
                </p>
              </div>

              <div>
                <label className="font-bold text-[var(--brand-text-main)] block mb-1 text-xs">
                  Describe problem impact (Optional):
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Muddy water collects here every morning making it hard for kids to walk to school..."
                  className="w-full p-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-card)] text-[var(--brand-text-main)] text-xs font-medium focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </div>

              {/* Final Summary Card */}
              <div className="p-4 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--brand-text-muted)]">Issue Category:</span>
                  <span className="font-bold text-[var(--brand-text-main)] uppercase">{issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--brand-text-muted)]">Estimated Severity:</span>
                  <span className="font-bold text-rose-600 uppercase">{severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--brand-text-muted)]">Location:</span>
                  <span className="font-bold text-[var(--brand-text-main)]">{villageOrArea}, {district}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl text-[var(--brand-text-secondary)] hover:bg-[var(--brand-surface)] text-xs font-bold"
                >
                  ← Back to Location
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-primary-fg)] font-bold text-sm flex items-center space-x-2 shadow-theme cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? 'Submitting Report...' : 'SUBMIT REPORT'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUBMISSION COMPLETE */}
          {step === 5 && createdReport && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] flex items-center justify-center mx-auto shadow-theme">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-[var(--brand-text-main)]">
                  Report Submitted Successfully!
                </h4>
                <p className="text-xs text-[var(--brand-text-secondary)] mt-1">
                  Your report has been logged and assigned an intelligent priority score.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] inline-block max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--brand-text-muted)]">Report ID:</span>
                  <span className="font-bold text-sm text-[var(--brand-primary)]">{createdReport.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--brand-text-muted)]">{t.priorityScore}:</span>
                  <span className="font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full">
                    {createdReport.priorityScore}/100 ({createdReport.priorityLevel})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--brand-text-muted)]">Status:</span>
                  <span className="font-bold text-[var(--brand-text-main)]">{createdReport.status}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold text-sm shadow-md"
                >
                  Done & Track Report
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
