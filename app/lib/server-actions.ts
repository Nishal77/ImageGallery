'use server';

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { generateOTP } from "@/lib/utils"
import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTP(email: string) {
  try {
    const supabase = createClient()
    
    // Generate OTP and expiration time
    const otp = generateOTP()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes expiry

    // First, try to find if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    // If user doesn't exist, create one with pending status
    if (!existingUser) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(), // Generate a random password as we're using passwordless
        options: {
          data: {
            status: 'pending',
          },
        },
      })

      if (signUpError) {
        console.error('Sign up error:', signUpError)
        return { 
          success: false, 
          message: 'Failed to create account' 
        }
      }
    }

    // Update user with new OTP
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        otp,
        otp_created_at: now.toISOString(),
        otp_expires_at: expiresAt.toISOString(),
      }
    })

    if (updateError) {
      console.error('Update error:', updateError)
      return { 
        success: false, 
        message: 'Failed to generate verification code' 
      }
    }

    // Send OTP via email using Resend
    try {
      await resend.emails.send({
        from: 'Sentia <onboarding@resend.dev>',
        to: email,
        subject: 'Your Verification Code for Sentia',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Verification Code</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .otp-container {
                  background-color: #f9f9f9;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
                  text-align: center;
                }
                .otp-code {
                  font-size: 32px;
                  font-weight: bold;
                  color: #0066cc;
                  letter-spacing: 4px;
                }
                .expiry-text {
                  color: #666;
                  font-size: 14px;
                  margin-top: 10px;
                }
              </style>
            </head>
            <body>
              <h1>Verification Code</h1>
              <p>Hello,</p>
              <p>Your verification code for Sentia is:</p>
              <div class="otp-container">
                <div class="otp-code">${otp}</div>
              </div>
              <p class="expiry-text">This code will expire in 5 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <p>Best regards,<br>The Sentia Team</p>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return { 
        success: false, 
        message: 'Failed to send verification code' 
      }
    }

    return { 
      success: true, 
      message: 'Verification code sent to your email' 
    }
  } catch (error) {
    console.error('Server error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send verification code' 
    }
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    const supabase = createClient()

    // Get user data to verify OTP
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User fetch error:', userError)
      return { 
        success: false, 
        message: 'User not found' 
      }
    }

    // Check if OTP matches and is not expired
    const storedOTP = user.user_metadata.otp
    const expiresAt = new Date(user.user_metadata.otp_expires_at)

    if (!storedOTP || storedOTP !== otp) {
      return { 
        success: false, 
        message: 'Invalid verification code' 
      }
    }

    if (expiresAt < new Date()) {
      return { 
        success: false, 
        message: 'Verification code has expired' 
      }
    }

    // Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: user.user_metadata.password || crypto.randomUUID(),
    })

    if (signInError) {
      console.error('Sign in error:', signInError)
      return { 
        success: false, 
        message: 'Failed to sign in' 
      }
    }

    // Update user status and clear OTP
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        status: 'active',
        otp: null,
        otp_created_at: null,
        otp_expires_at: null,
        email_verified: true,
        last_sign_in: new Date().toISOString()
      }
    })

    if (updateError) {
      console.error('User update error:', updateError)
    }

    return { 
      success: true, 
      message: 'Successfully verified' 
    }
  } catch (error) {
    console.error('Server error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to verify code' 
    }
  }
}

export async function updateUserAfterOAuthLogin(userId: string) {
  'use server';
  
  const supabase = createClient();
  
  try {
    // Update the user's status to 'active' if they signed in with OAuth
    const { error } = await supabase
      .from('auth.users')
      .update({ status: 'active' })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true, message: 'User status updated successfully' };
  } catch (error) {
    console.error('Error updating user after OAuth login:', error);
    return { success: false, message: 'Failed to update user status' };
  }
} 