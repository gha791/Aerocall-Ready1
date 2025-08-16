# AEROCALL - Local Development Setup

## Quick Start

1. **Install dependencies**: `npm install`
2. **Create `.env.local`** with required variables
3. **Run dev server**: `npm run dev`
4. **Access app**: http://localhost:9002

## Environment Variables

### Required:
```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dispatchconnect-7nqgs.appspot.com
NEXT_PUBLIC_SITE_URL=http://localhost:9002
```

### Optional (for full features):
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
RC_SERVER_URL=https://platform.ringcentral.com
RC_CLIENT_ID=your_client_id
RC_CLIENT_SECRET=your_client_secret
RC_ADMIN_JWT=your_admin_jwt
RC_FROM_NUMBER=+1234567890
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_token
```

## Authentication

The app works in development mode without the Firebase Service Account Key, but with limited server-side features.
