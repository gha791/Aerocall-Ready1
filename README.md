# AEROCALL - Next.js Starter

This is a NextJS starter app for AEROCALL, an all-in-one cloud phone system for all businesses.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Aerocall
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:9002](http://localhost:9002)

## 📋 Prerequisites

Before deploying, ensure you have:
- **RingCentral Developer Account** - for calling features
- **Firebase Project** - for authentication and database
- **Google AI Studio Account** - for AI features (optional)
- **Paddle Account** - for billing (optional)

## 🚀 Deployment

### Vercel Deployment (Recommended)

The easiest way to deploy AEROCALL is using [Vercel](https://vercel.com).

1. **Push to GitHub**: Upload your code to a GitHub repository
2. **Import to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Connect your GitHub account and select the repository
3. **Configure Environment Variables**: Add all required environment variables
4. **Deploy**: Click "Deploy" and wait for the build to complete

### Environment Variables

You'll need to configure these environment variables in Vercel:

**RingCentral Configuration:**
- `RC_SERVER_URL` - RingCentral server URL
- `RC_CLIENT_ID` - Your RingCentral app client ID
- `RC_CLIENT_SECRET` - Your RingCentral app client secret
- `RC_ADMIN_JWT` - RingCentral admin JWT token
- `RC_FROM_NUMBER` - Default caller ID number

**Firebase Configuration:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket

**Site Configuration:**
- `NEXT_PUBLIC_SITE_URL` - Your Vercel domain URL

**AI Configuration:**
- `GEMINI_API_KEY` - Google Gemini API key (optional)

**Billing Configuration:**
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` - Paddle client token (optional)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── ai/                  # AI integration and flows
```

## 🔧 Configuration

The project uses several external services:

- **Next.js 15** - React framework with app router
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication and database
- **RingCentral** - Voice calling and messaging
- **Google Gemini** - AI-powered call analysis
- **Paddle** - Subscription billing

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [RingCentral Developer Portal](https://developers.ringcentral.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
