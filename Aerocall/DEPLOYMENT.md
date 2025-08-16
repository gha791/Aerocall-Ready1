# AEROCALL - Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **RingCentral Account**: Set up RingCentral developer account
4. **Firebase Project**: Create a Firebase project for authentication and database
5. **Google AI Studio**: Get Gemini API key for AI features

## Environment Variables Required

Add these environment variables in your Vercel project settings:

### RingCentral Configuration
```
RC_SERVER_URL=https://platform.ringcentral.com
RC_CLIENT_ID=your_ringcentral_client_id
RC_CLIENT_SECRET=your_ringcentral_client_secret
RC_ADMIN_JWT=your_ringcentral_admin_jwt
RC_FROM_NUMBER=+1234567890
```

### Firebase Configuration
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### AI Configuration
```
GEMINI_API_KEY=your_gemini_api_key
```

### Paddle Configuration (for billing)
```
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_paddle_client_token
```

## Deployment Steps

1. **Import Project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Connect your GitHub account
   - Select your AEROCALL repository

2. **Configure Environment Variables**:
   - In the import screen, expand "Environment Variables"
   - Add each variable from the list above
   - Make sure to copy the exact values from your `.env.local` file

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically detect Next.js and build the project

## Build Configuration

The project is already configured for Vercel with:
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (specified in package.json)

## Post-Deployment

1. **Update Site URL**: After deployment, update `NEXT_PUBLIC_SITE_URL` with your actual Vercel domain
2. **Test Authentication**: Verify Firebase authentication works
3. **Test RingCentral Integration**: Make sure calling features work
4. **Monitor Logs**: Check Vercel function logs for any issues

## Troubleshooting

### Build Errors
- Ensure all environment variables are set correctly
- Check that Firebase service account key is properly formatted
- Verify RingCentral credentials are valid

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are accessible in production
- Ensure Firebase project is properly configured

### Authentication Issues
- Verify Firebase configuration
- Check that `NEXT_PUBLIC_SITE_URL` matches your Vercel domain
- Ensure session cookies are working properly

## Security Notes

- Never commit `.env.local` files to your repository
- Use Vercel's environment variable encryption for sensitive data
- Regularly rotate API keys and secrets
- Monitor usage and costs for external services

## Support

For issues with:
- **Vercel**: Check [Vercel documentation](https://vercel.com/docs)
- **RingCentral**: Visit [RingCentral developer portal](https://developers.ringcentral.com)
- **Firebase**: Check [Firebase documentation](https://firebase.google.com/docs)
- **Next.js**: Visit [Next.js documentation](https://nextjs.org/docs)
