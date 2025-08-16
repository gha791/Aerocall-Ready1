export const serverConfig = {
  // RingCentral Configuration
  ringCentral: {
    serverUrl: process.env.RC_SERVER_URL || '',
    clientId: process.env.RC_CLIENT_ID || '',
    clientSecret: process.env.RC_CLIENT_SECRET || '',
    adminJwt: process.env.RC_ADMIN_JWT || '',
    fromNumber: process.env.RC_FROM_NUMBER || '',
  },
  
  // Firebase Configuration
  firebase: {
    serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  },
  
  // Site Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  // AI Configuration
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },
  
  // Paddle Configuration
  paddle: {
    clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
  },
};

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
