// Application Configuration
export const APP_CONFIG = {
  // Basic App Info
  name: import.meta.env.VITE_APP_NAME || "HUMSJ IT Sector",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  description: import.meta.env.VITE_APP_DESCRIPTION || "Haramaya University Muslim Students Jama'a IT Sector Platform",
  environment: import.meta.env.VITE_APP_ENV || "development",
  
  // URLs and Endpoints
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL!,
  supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  
  // External APIs
  apis: {
    prayerTimes: import.meta.env.VITE_PRAYER_TIMES_API || "https://api.aladhan.com/v1",
    quran: import.meta.env.VITE_QURAN_API || "https://api.quran.com/api/v4",
    islamicCalendar: import.meta.env.VITE_ISLAMIC_CALENDAR_API || "https://api.islamicfinder.us/v1",
    googleMaps: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY!,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!,
  },
  
  // Feature Flags
  features: {
    pwa: import.meta.env.VITE_ENABLE_PWA === "true",
    offlineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === "true",
    pushNotifications: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === "true",
    geolocation: import.meta.env.VITE_ENABLE_GEOLOCATION === "true",
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === "true",
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === "true",
  },
  
  // Contact Information
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || "info@humsj.et",
    phone: import.meta.env.VITE_CONTACT_PHONE || "+251-25-666-0000",
    address: import.meta.env.VITE_CONTACT_ADDRESS || "Haramaya University, Dire Dawa, Ethiopia",
    organization: import.meta.env.VITE_ORGANIZATION_NAME || "HUMSJ IT Sector",
  },
  
  // Default Settings
  defaults: {
    language: "en",
    theme: "light",
    prayerCalculationMethod: 2, // Muslim World League
    madhab: 0, // Shafi
    timezone: "Africa/Addis_Ababa",
    coordinates: {
      latitude: 9.4103, // Haramaya University
      longitude: 42.0461,
    },
  },
  
  // Limits and Constraints
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxUploadFiles: 10,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    cacheTimeout: 60 * 60 * 1000, // 1 hour
  },
  
  // Production Settings
  production: {
    enableLogging: false,
    enableDebug: false,
    enableDevTools: false,
    compressionLevel: 9,
    cacheMaxAge: 31536000, // 1 year
  },
  
  // Development Settings
  development: {
    enableLogging: true,
    enableDebug: true,
    enableDevTools: true,
    hotReload: true,
    mockData: true,
  },
} as const;

// Type-safe environment check
export const isDevelopment = APP_CONFIG.environment === "development";
export const isProduction = APP_CONFIG.environment === "production";
export const isTest = APP_CONFIG.environment === "test";

// Validation
if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseKey) {
  throw new Error("Missing required Supabase configuration");
}

if (!APP_CONFIG.cloudinary.cloudName || !APP_CONFIG.cloudinary.uploadPreset) {
  throw new Error("Missing required Cloudinary configuration");
}