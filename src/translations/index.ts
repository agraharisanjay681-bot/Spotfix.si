export type Language = 'en' | 'hi';

export const translations = {
  en: {
    appName: 'SPOT FIX',
    tagline: 'See It. Snap It. Solve It.',
    heroSub: 'AI-Powered Civic Issue Detection & Smart Reporting for Rural & Urban Communities',
    reportIssueBtn: 'Report an Issue',
    exploreMapBtn: 'Explore Community Map',
    viewCaseStudiesBtn: 'View Impact Case Studies',
    
    // Roles
    roleCitizen: 'Rural Citizen',
    roleAuthority: 'Municipal Authority',
    roleNgo: 'NGO / Volunteer',
    
    // Nav
    navHome: 'Home',
    navMap: 'Live Map',
    navMyReports: 'My Reports',
    navAuthority: 'Authority Portal',
    navCaseStudies: 'Case Studies',
    navContact: 'Contact Us',
    
    // Reporting flow steps
    step1Photo: '1. Snap Photo',
    step2AI: '2. AI Analysis',
    step3Location: '3. Location',
    step4Details: '4. Details',
    step5Submit: '5. Submit',
    
    // AI Detection
    aiAnalyzing: 'Analyzing image with Gemini Vision AI...',
    aiDetectingIssue: 'Detecting infrastructure problem...',
    aiConfidence: 'AI Confidence',
    aiDisclaimer: 'AI predictions are automated guidelines and should be verified by authorities.',
    aiSeverity: 'Estimated Severity',
    
    // Priority
    priorityScore: 'SPOT FIX Priority Score',
    priorityCritical: 'CRITICAL',
    priorityHigh: 'HIGH',
    priorityMedium: 'MEDIUM',
    priorityLow: 'LOW',
    
    // Duplicate warning
    duplicateWarningTitle: 'Similar Issue Detected Nearby',
    duplicateWarningDesc: 'A report with similar characteristics exists within 100 meters. Would you like to support it instead of creating a duplicate?',
    supportExistingBtn: 'Support Existing Report',
    continueAnywayBtn: 'Submit New Report Anyway',
    
    // Actions
    supportButton: 'I Face This Problem Too',
    supported: 'You Supported This',
    trackReport: 'Track Report',
    viewDetails: 'View Details',
    assignDepartment: 'Assign Department',
    updateStatus: 'Update Status',
    
    // Statuses
    statusSubmitted: 'Submitted',
    statusAIAnalyzed: 'AI Analyzed',
    statusUnderReview: 'Under Review',
    statusVerified: 'Verified',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    
    // Categories
    cat_pothole: 'Pothole',
    cat_road_damage: 'Road Damage',
    cat_garbage: 'Garbage Accumulation',
    cat_broken_streetlight: 'Broken Streetlight',
    cat_open_drain: 'Open Drain',
    cat_water_leakage: 'Water Leakage',
    cat_damaged_property: 'Damaged Public Property',
    cat_unsafe_road: 'Unsafe Road Condition',
    cat_other: 'Other Issue',
    
    // General UI
    lowBandwidthMode: 'Low-Bandwidth Mode Active',
    draftSavedLocally: 'Draft saved locally. Will sync when online.',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
  },
  hi: {
    appName: 'स्पॉट फिक्स (SPOT FIX)',
    tagline: 'देखो। खींचो। सुलझाओ।',
    heroSub: 'ग्रामीण और शहरी क्षेत्रों के लिए एआई-संचालित नागरिक समस्या पहचान और त्वरित रिपोर्टिंग मंच',
    reportIssueBtn: 'समस्या की रिपोर्ट करें',
    exploreMapBtn: 'सामुदायिक मानचित्र देखें',
    viewCaseStudiesBtn: 'प्रभावित मामले अध्ययन (Case Studies)',
    
    // Roles
    roleCitizen: 'ग्रामीण नागरिक',
    roleAuthority: 'नगरपालिका / प्रशासन',
    roleNgo: 'एनजीओ / स्वयंसेवक',
    
    // Nav
    navHome: 'मुख्य पृष्ठ',
    navMap: 'लाइव मैप',
    navMyReports: 'मेरी रिपोर्ट',
    navAuthority: 'प्रशासन पोर्टल',
    navCaseStudies: 'सफलता की कहानियाँ',
    navContact: 'संपर्क करें',
    
    // Reporting flow steps
    step1Photo: '१. फोटो खींचें',
    step2AI: '२. एआई जांच',
    step3Location: '३. स्थान',
    step4Details: '४. विवरण',
    step5Submit: '५. जमा करें',
    
    // AI Detection
    aiAnalyzing: 'जेमिनी एआई फोटो का विश्लेषण कर रहा है...',
    aiDetectingIssue: 'समस्या की पहचान की जा रही है...',
    aiConfidence: 'एआई विश्वास दर',
    aiDisclaimer: 'एआई भविष्यवाणियां स्वचालित मार्गदर्शन हैं, आधिकारिक सत्यापन आवश्यक है।',
    aiSeverity: 'अनुमानित गंभीरता',
    
    // Priority
    priorityScore: 'स्पॉट फिक्स प्राथमिकता स्कोर',
    priorityCritical: 'अत्यंत गंभीर',
    priorityHigh: 'उच्च प्राथमिकता',
    priorityMedium: 'मध्यम प्राथमिकता',
    priorityLow: 'सामान्य',
    
    // Duplicate warning
    duplicateWarningTitle: 'पास में मिलती-जुलती समस्या मिली',
    duplicateWarningDesc: 'इस स्थान के 100 मीटर के भीतर एक समान रिपोर्ट पहले से मौजूद है। क्या आप उसका समर्थन करना चाहते हैं?',
    supportExistingBtn: 'मौजूदा रिपोर्ट का समर्थन करें',
    continueAnywayBtn: 'नई रिपोर्ट जमा करें',
    
    // Actions
    supportButton: 'मुझे भी यह समस्या है',
    supported: 'आपने समर्थन किया है',
    trackReport: 'रिपोर्ट ट्रैक करें',
    viewDetails: 'विवरण देखें',
    assignDepartment: 'विभाग सौंपें',
    updateStatus: 'स्थिति अपडेट करें',
    
    // Statuses
    statusSubmitted: 'जमा की गई',
    statusAIAnalyzed: 'एआई विश्लेषित',
    statusUnderReview: 'समीक्षाधीन',
    statusVerified: 'सत्यापित',
    statusAssigned: 'विभाग आवंटित',
    statusInProgress: 'काम जारी है',
    statusResolved: 'समाधान हो गया',
    statusClosed: 'बंद',
    
    // Categories
    cat_pothole: 'सड़क का गड्ढा (Pothole)',
    cat_road_damage: 'टूटी सड़क',
    cat_garbage: 'कचरे का ढेर',
    cat_broken_streetlight: 'खराब स्ट्रीटलाइट',
    cat_open_drain: 'खुला नाला',
    cat_water_leakage: 'पानी का रिसाव',
    cat_damaged_property: 'सरकारी संपत्ति क्षति',
    cat_unsafe_road: 'असुरक्षित सड़क',
    cat_other: 'अन्य समस्या',
    
    // General UI
    lowBandwidthMode: 'कम इंटरनेट स्पीड मोड चालू',
    draftSavedLocally: 'ड्राफ्ट स्थानीय रूप से सहेजा गया।',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    language: 'भाषा',
  },
};
