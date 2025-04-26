"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";
const ONE_WEEK = 60 * 60 * 24 * 7;
export async function signUp(params: SignUpParams){
    const {uid, name, email}= params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
            success: false,
            message: "User already exists"
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })
        return {
            success: true,
            message: 'Account created succesfully, Please Sign in'
        }
    } catch (error) {
        console.log("Error creating a user:",error);
    
    if ((error as any).code === 'auth/email-already-exists') {
        return{
            success: false,
            message: "Email already exists try different email id"
        }
    }
    return{
        success: false,
        message: "Faill to creat some error occure!"
    }
    }
}
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User not found"
            }
        }

        // const idToken = await auth.createCustomToken(userRecord.uid);-0
        await setSessionCookies(idToken);
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Login fail some error occure"
        }
    }
    
}
export async function setSessionCookies(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie =  await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}


export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie) return null;
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord) return null;
        return {
            ...userRecord.data(),
            id: userRecord.id
        }as User;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user; 
}

