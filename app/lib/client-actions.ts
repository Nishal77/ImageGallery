'use client'

import { useState } from 'react'
import { sendOTP, verifyOTP } from './server-actions'
import { useRouter } from 'next/navigation'

export function useOTPActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSendOTP = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const result = await sendOTP(email)
      setSuccess(result.message)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const result = await verifyOTP(email, otp)
      setSuccess(result.message)
      router.push('/dashboard') // Redirect to dashboard after successful verification
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    success,
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP
  }
} 