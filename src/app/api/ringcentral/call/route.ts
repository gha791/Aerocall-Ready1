
import { NextResponse, NextRequest } from 'next/server';
import { SDK } from '@ringcentral/sdk';
import { db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { auth as adminAuth } from 'firebase-admin';

// Initialize the RingCentral SDK
const rcsdk = new SDK({
  server: process.env.RC_SERVER_URL,
  clientId: process.env.RC_CLIENT_ID,
  clientSecret: process.env.RC_CLIENT_SECRET,
});

const platform = rcsdk.platform();

async function login() {
  if (!(await platform.loggedIn())) {
    await platform.login({ jwt: process.env.RC_ADMIN_JWT });
  }
}


async function getUserIdFromSession(request: NextRequest): Promise<string | null> {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) return null;

    try {
        const decodedToken = await adminAuth().verifySessionCookie(sessionCookie, true);
        return decodedToken.uid;
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return null;
    }
}


export async function POST(request: NextRequest) {
  try {
    const { toNumber, fromNumber } = await request.json();
    
    if (!toNumber) {
      return NextResponse.json({ error: 'Missing "toNumber" in request body' }, { status: 400 });
    }
     if (!fromNumber) {
      return NextResponse.json({ error: 'Missing "fromNumber" (caller ID) in request body' }, { status: 400 });
    }

    const userId = await getUserIdFromSession(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    const userData = userDoc.data();
    
    const extensionId = userData?.ringcentralExtensionId;
    const allowedNumbers = userData?.assignedPhoneNumbers || [];

    if (!allowedNumbers.includes(fromNumber)) {
        return NextResponse.json({ error: 'You are not authorized to use this caller ID.'}, { status: 403});
    }

    if (!extensionId) {
      return NextResponse.json({ error: 'User is not provisioned for calling' }, { status: 403 });
    }

    await login();

    const ringoutResponse = await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
      from: { phoneNumber: fromNumber },
      to: { phoneNumber: toNumber },
      country: { id: '1' },
      callerId: { phoneNumber: fromNumber },
      playPrompt: true,
    });

    const ringoutData = await ringoutResponse.json();
    
    return NextResponse.json({ success: true, details: ringoutData });

  } catch (e: any) {
    console.error('RingCentral API Error:', e);
    const errorDetails = e.message || 'An unknown error occurred.';
    if (e.response) {
      const errorBody = await e.response.json();
      console.error("API Error Body:", errorBody);
      return NextResponse.json({ error: 'Failed to initiate call', details: errorBody.message || errorDetails }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to initiate call', details: errorDetails }, { status: 500 });
  }
}
