
'use server';

import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the admin SDK if it hasn't been already
import { app } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  if (!app || !auth || typeof auth().verifySessionCookie !== 'function') {
    console.error("Firebase Admin SDK not properly initialized");
    return NextResponse.json({ error: "Authentication service not available." }, { status: 500 });
  }
  
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
    if (decodedToken) {
      return NextResponse.json({ success: true, uid: decodedToken.uid }, { status: 200 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
