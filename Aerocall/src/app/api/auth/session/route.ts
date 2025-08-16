
'use server';

import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the admin SDK if it hasn't been already
import { app } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  // Check if the admin SDK was initialized
  if (!app || !auth || typeof auth().createSessionCookie !== 'function') {
     console.error("Firebase Admin SDK not properly initialized");
     return NextResponse.json({ error: "Authentication service not available. Please try again later." }, { status: 500 });
  }
    
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    
    try {
        const decodedToken = await auth().verifyIdToken(idToken);

        if (decodedToken) {
          // Set session expiration to 5 days.
          const expiresIn = 60 * 60 * 24 * 5 * 1000;
          const sessionCookie = await auth().createSessionCookie(idToken, {
            expiresIn,
          });
          const options = {
            name: 'session',
            value: sessionCookie,
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
          };

          (await cookies()).set(options);
          return NextResponse.json({ status: 'success' }, { status: 200 });
        }
    } catch (error: any) {
        console.error("Error verifying ID token:", error);
        return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function DELETE(request: NextRequest) {
    const options = {
        name: 'session',
        value: '',
        maxAge: -1,
    };

    (await cookies()).set(options);
    
    return NextResponse.json({}, { status: 200 });
}
