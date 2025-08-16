
'use server';

export async function makeCallApi(toNumber: string, fromNumber: string) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ringcentral/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ toNumber, fromNumber }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.details || errorData.error || 'Failed to initiate call');
  }

  return response.json();
}
