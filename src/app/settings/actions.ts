
'use server';

import { db, auth as adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { TeamMember, User as AppUser } from "@/types";
import crypto from "crypto";
import { cookies } from "next/headers";

async function getAuthenticatedUser(): Promise<{uid: string, teamId: string} | null> {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) return null;

    try {
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userDoc.data();
        
        if (!userData?.teamId) {
            // For simplicity in this demo, we'll assign a teamId if it doesn't exist.
            // In a real app, this would be part of the signup/onboarding flow.
            const teamId = `team_${decodedToken.uid}`;
            await db.collection('users').doc(decodedToken.uid).update({ teamId });
            return { uid: decodedToken.uid, teamId };
        }

        return { uid: decodedToken.uid, teamId: userData.teamId };
    } catch (error) {
        console.error("Auth error in server action:", error);
        return null;
    }
}


const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["Admin", "Agent"]),
});

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    businessName: z.string().optional(),
    state: z.string().optional(),
    registeredCountry: z.string().optional(),
});


export async function getUserProfileAction(): Promise<{ user?: AppUser | null, error?: string }> {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: 'Authentication required.' };
    
    try {
        const userRef = db.collection('users').doc(authUser.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            return { error: 'User profile not found.' };
        }
        return { user: doc.data() as AppUser };

    } catch(e: any) {
        return { error: e.message || "Failed to fetch user profile." }
    }
}


export async function updateUserProfileAction(input: z.infer<typeof profileSchema>) {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: 'Authentication required.' };

    const validated = profileSchema.safeParse(input);
    if (!validated.success) {
        return { error: 'Invalid input.' };
    }

    try {
        const userRef = db.collection('users').doc(authUser.uid);

        const { firstName, lastName, ...otherData } = validated.data;
        const name = `${firstName} ${lastName}`.trim();

        const updateData = {
            ...otherData,
            firstName,
            lastName,
            name,
        };
        
        // Also update the Firebase Auth profile
        await adminAuth.updateUser(authUser.uid, { displayName: name });
        await userRef.update(updateData);

        revalidatePath('/settings');
        return { user: { ...updateData, uid: authUser.uid } };
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}


export async function inviteTeamMemberAction(input: {email: string, role: string}) {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: 'Authentication required.' };
    
    const validated = inviteSchema.safeParse(input);
    if (!validated.success) {
        return { error: 'Invalid input.' };
    }
    const { email, role } = validated.data;
    
    try {
        // Check if user already exists in the team
        const existingUserSnapshot = await db.collection('users').where('email', '==', email).where('teamId', '==', authUser.teamId).get();
        if (!existingUserSnapshot.empty) {
            return { error: 'A user with this email already exists in your team.' };
        }

        // Check for an existing pending invitation
        const invitationSnapshot = await db.collection('invitations').where('email', '==', email).where('teamId', '==', authUser.teamId).get();
        if (!invitationSnapshot.empty) {
            return { error: 'An invitation has already been sent to this email address.' };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

        await db.collection('invitations').add({
            teamId: authUser.teamId,
            email,
            role,
            token,
            expiresAt,
            createdAt: new Date(),
        });
        
        revalidatePath('/settings');
        return {};

    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}


export async function getTeamMembersAction(): Promise<{ members?: TeamMember[], currentUserId?: string, error?: string }> {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: 'Authentication required.' };

    try {
        // Get active users
        const usersSnapshot = await db.collection('users').where('teamId', '==', authUser.teamId).get();
        const activeMembers: TeamMember[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                email: data.email,
                name: data.name || null,
                role: data.role,
                status: 'active',
                avatar: data.avatar || '',
            }
        });

        // Get pending invitations
        const invitationsSnapshot = await db.collection('invitations').where('teamId', '==', authUser.teamId).get();
        const pendingMembers: TeamMember[] = invitationsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id, // Using doc id as temporary key
                email: data.email,
                name: null,
                role: data.role,
                status: 'pending',
            }
        });
        
        const allMembers = [...activeMembers, ...pendingMembers];

        return { members: allMembers, currentUserId: authUser.uid };
    } catch (e: any) {
        return { error: e.message || 'Failed to fetch team members.' };
    }
}

export async function updateTeamMemberRoleAction(uid: string, role: string) {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: 'Authentication required.' };
    
    if (role !== 'Admin' && role !== 'Agent') return { error: 'Invalid role specified.' };
    
    try {
        const memberRef = db.collection('users').doc(uid);
        const memberDoc = await memberRef.get();

        if (!memberDoc.exists || memberDoc.data()?.teamId !== authUser.teamId) {
            return { error: 'Member not found in your team.' };
        }

        await memberRef.update({ role });
        revalidatePath('/settings');
        return {};
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function removeTeamMemberAction(uid: string) {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return { error: 'Authentication required.' };
    
     try {
        const memberRef = db.collection('users').doc(uid);
        const memberDoc = await memberRef.get();

        if (memberDoc.exists && memberDoc.data()?.teamId === authUser.teamId) {
            // In a real app, you would also delete the user from Firebase Auth
            // await adminAuth.deleteUser(uid);
            await memberRef.delete();
        } else {
            // If it's a pending invitation, it won't be in users collection.
            const invitationRef = db.collection('invitations').doc(uid);
            const invitationDoc = await invitationRef.get();
            if (invitationDoc.exists && invitationDoc.data()?.teamId === authUser.teamId) {
                await invitationRef.delete();
            } else {
                 return { error: 'Member or invitation not found.' };
            }
        }

        revalidatePath('/settings');
        return {};
    } catch (e: any) {
        return { error: e.message };
    }
}
