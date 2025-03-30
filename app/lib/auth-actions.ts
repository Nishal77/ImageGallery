'use client';

import { createClient } from '@/utils/supabase/client'
import { sendOTP as serverSendOTP, verifyOTP as serverVerifyOTP } from './server-actions'
import { redirect } from 'next/navigation';

export async function signInWithGoogle() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        queryParams: {
          prompt: 'select_account',
        }
      },
    })

    if (error) throw error
  } catch (error) {
    console.error('Error signing in with Google:', error)
  }
}

// Client-side wrapper for server action
export async function sendOTP(email: string) {
  try {
    const result = await serverSendOTP(email)
    return result
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to send OTP')
  }
}

// Client-side wrapper for server action
export async function verifyOTP(email: string, otp: string) {
  try {
    const result = await serverVerifyOTP(email, otp)
    return result
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to verify OTP')
  }
} 