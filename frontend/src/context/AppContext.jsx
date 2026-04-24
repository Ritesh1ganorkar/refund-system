import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const translations = {
  en: {
    heroTitle: "The Ultimate Smart Refund System",
    heroSub: "Experience frictionless shopping with our state-of-the-art AI automated refund infrastructure.",
    runDemo: "🚀 Run AI Demo",
    instantRefund: "⚡ Instant Refund",
    searchPlaceholder: "Search premium products...",
    searchBtn: "Search",
    aiPowered: "AI Powered",
    instantEligible: "Instant Eligible",
    fraudDetection: "Fraud Detection",
    buyNow: "Buy Now",
    lowReturn: "Low Return Rate",
    trustedUser: "Trusted User",
    riskyUser: "Risky User",
    orders: "Orders",
    refundSpeed: "Refund Speed",
    successRate: "Success Rate",
    aiAnalyzing: "AI Analyzing Image...",
    aiApproved: "Condition Verified (AI Approved)",
    viewDetails: "View Details",
    customerDashboard: "Customer Dashboard",
    manageBusiness: "Manage Business",
    returnRequests: "Return Requests",
    approveReturn: "Approve Return",
    markPickedUp: "Mark Picked Up",
    issueRefund: "Issue Refund",
    uploadEvidence: "Upload Evidence (Required)",
    submitReturn: "Submit Return Request",
    trustScore: "Trust Score",
    totalProducts: "Total Products",
    totalOrders: "Total Orders",
    returnRate: "Return Rate",
    fraudSuspected: "Fraud Suspected",
    verified: "Verified",
    risky: "Risky",
    login: "Login / Sign Up",
    logout: "Logout",
    dashboard: "Dashboard"
  },
  hi: {
    heroTitle: "अल्टीमेट स्मार्ट रिफंड सिस्टम",
    heroSub: "हमारे अत्याधुनिक AI ऑटोमेटेड रिफंड इंफ्रास्ट्रक्चर के साथ घर्षण रहित खरीदारी का अनुभव करें।",
    runDemo: "🚀 AI डेमो चलाएं",
    instantRefund: "⚡ त्वरित रिफंड",
    searchPlaceholder: "प्रीमियम उत्पाद खोजें...",
    searchBtn: "खोजें",
    aiPowered: "AI संचालित",
    instantEligible: "त्वरित योग्य",
    fraudDetection: "धोखाधड़ी का पता लगाना",
    buyNow: "अभी खरीदें",
    lowReturn: "कम वापसी दर",
    trustedUser: "विश्वसनीय उपयोगकर्ता",
    riskyUser: "जोखिम भरा उपयोगकर्ता",
    orders: "ऑर्डर",
    refundSpeed: "रिफंड गति",
    successRate: "सफलता दर",
    aiAnalyzing: "AI छवि का विश्लेषण कर रहा है...",
    aiApproved: "स्थिति सत्यापित (AI स्वीकृत)",
    viewDetails: "विवरण देखें",
    customerDashboard: "ग्राहक डैशबोर्ड",
    manageBusiness: "व्यवसाय प्रबंधित करें",
    returnRequests: "वापसी अनुरोध",
    approveReturn: "वापसी स्वीकृत करें",
    markPickedUp: "पिकअप चिह्नित करें",
    issueRefund: "रिफंड जारी करें",
    uploadEvidence: "सबूत अपलोड करें (आवश्यक)",
    submitReturn: "वापसी अनुरोध सबमिट करें",
    trustScore: "विश्वास स्कोर",
    totalProducts: "कुल उत्पाद",
    totalOrders: "कुल ऑर्डर",
    returnRate: "वापसी दर",
    fraudSuspected: "धोखाधड़ी का संदेह",
    verified: "सत्यापित",
    risky: "जोखिम भरा",
    login: "लॉग इन / साइन अप",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड"
  }
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
};
