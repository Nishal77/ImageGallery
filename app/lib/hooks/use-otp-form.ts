'use client'

import { useState, useEffect, useCallback } from 'react'
import { sendOTP, verifyOTP } from '@/lib/server-actions'
import { useRouter } from 'next/navigation'

const MAX_DAILY_ATTEMPTS = 5; // Maximum OTP requests per day
const LOCKOUT_TIMES = [0, 0, 5, 20, 240]; // Progressive lockout times in minutes (0, 0, 5min, 20min, 4hr)

export function useOtpForm() {
  const [email, setEmail] = useState('')
  const [otp, setOTP] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const router = useRouter()

  // OTP security tracking
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [dailyAttempts, setDailyAttempts] = useState<number>(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  
  // Initialize state from localStorage only on the client side
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Load failed attempts
    const storedFailedAttempts = localStorage.getItem('otpFailedAttempts');
    if (storedFailedAttempts) {
      setFailedAttempts(parseInt(storedFailedAttempts, 10));
    }
    
    // Load daily attempts
    const savedAttempts = localStorage.getItem('otpDailyAttempts');
    const savedDate = localStorage.getItem('otpDailyAttemptsDate');
    
    if (savedDate && savedAttempts) {
      if (savedDate === new Date().toDateString()) {
        setDailyAttempts(parseInt(savedAttempts, 10));
      } else {
        // Reset for new day
        localStorage.setItem('otpDailyAttemptsDate', new Date().toDateString());
        localStorage.setItem('otpDailyAttempts', '0');
      }
    } else {
      // Initialize if not set
      localStorage.setItem('otpDailyAttemptsDate', new Date().toDateString());
      localStorage.setItem('otpDailyAttempts', '0');
    }
    
    // Load lockout time
    const lockedTime = localStorage.getItem('otpLockedUntil');
    if (lockedTime) {
      const lockDate = new Date(lockedTime);
      if (lockDate > new Date()) {
        setLockedUntil(lockDate);
      } else {
        // Clear expired lock
        localStorage.removeItem('otpLockedUntil');
      }
    }
  }, []);

  // Timer for countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])
  
  // Timer for lockout
  useEffect(() => {
    if (lockedUntil) {
      const checkLock = setInterval(() => {
        if (new Date() >= lockedUntil) {
          setLockedUntil(null);
          localStorage.removeItem('otpLockedUntil');
          clearInterval(checkLock);
        }
      }, 1000);
      
      return () => clearInterval(checkLock);
    }
  }, [lockedUntil]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Check if daily limit reached
    if (dailyAttempts >= MAX_DAILY_ATTEMPTS) {
      setError(`Maximum OTP requests (${MAX_DAILY_ATTEMPTS}) for today reached. Please try again tomorrow.`);
      return;
    }
    
    // Check if currently locked out
    if (lockedUntil && new Date() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / (60 * 1000));
      setError(`Too many failed attempts. Please try again in ${minutesLeft} minutes.`);
      return;
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const result = await sendOTP(email)
      
      if (result.success) {
        setSuccess('Verification code sent to your email')
        setCountdown(30) // Prevent spam by setting a cooldown
        
        // Update daily attempt counter
        const newDailyAttempts = dailyAttempts + 1;
        setDailyAttempts(newDailyAttempts);
        localStorage.setItem('otpDailyAttempts', newDailyAttempts.toString());
        localStorage.setItem('otpDailyAttemptsDate', new Date().toDateString());
      } else {
        setError(result.error || 'Failed to send verification code')
      }
    } catch (err) {
      setError('Failed to send verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !otp || otp.length !== 6) return
    
    // Check if currently locked out
    if (lockedUntil && new Date() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / (60 * 1000));
      setError(`Too many failed attempts. Please try again in ${minutesLeft} minutes.`);
      return;
    }

    setIsLoading(true)
    setError(null)
    setIsValid(false)
    setIsInvalid(false)

    try {
      const result = await verifyOTP(email, otp)
      if (result.success) {
        setIsValid(true)
        setSuccess('Verification successful! Redirecting...')
        
        // Reset failed attempts on success
        setFailedAttempts(0);
        localStorage.setItem('otpFailedAttempts', '0');
        
        // Wait for a brief moment to show the success state
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        // Handle failure and increment counter
        setIsInvalid(true)
        
        // Show an error only for non-validation errors
        if (result.error && !result.error.includes("Invalid OTP")) {
          setError(result.error)
        }
        
        setOTP('') // Clear OTP on error
        
        // Increment failed attempts
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        localStorage.setItem('otpFailedAttempts', newFailedAttempts.toString());
        
        // Apply lockout if necessary
        if (newFailedAttempts >= 2) {
          // Get appropriate lockout time (cap at the max index)
          const lockoutIndex = Math.min(newFailedAttempts, LOCKOUT_TIMES.length - 1);
          const lockoutMinutes = LOCKOUT_TIMES[lockoutIndex];
          
          if (lockoutMinutes > 0) {
            const lockUntil = new Date(new Date().getTime() + (lockoutMinutes * 60 * 1000));
            setLockedUntil(lockUntil);
            localStorage.setItem('otpLockedUntil', lockUntil.toString());
            setError(`Too many failed attempts. Please try again in ${lockoutMinutes} minutes.`);
          }
        }
      }
    } catch (err) {
      setIsInvalid(true)
      setError('Failed to verify OTP')
      setOTP('') // Clear OTP on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (value: string) => {
    setOTP(value)
    // Reset validation states when user starts typing
    setIsValid(false)
    setIsInvalid(false)
    setError(null)
  }

  // Calculate if user can resend OTP
  const canResendOTP = useCallback(() => {
    // Cannot resend if countdown is active
    if (countdown > 0) return false;
    
    // Cannot resend if daily limit reached
    if (dailyAttempts >= MAX_DAILY_ATTEMPTS) return false;
    
    // Cannot resend if locked out
    if (lockedUntil && new Date() < lockedUntil) return false;
    
    return true;
  }, [countdown, dailyAttempts, lockedUntil]);

  // Get remaining time in human readable format
  const getLockoutTimeRemaining = useCallback(() => {
    if (!lockedUntil || new Date() >= lockedUntil) return null;
    
    const diffMs = lockedUntil.getTime() - new Date().getTime();
    const diffMins = Math.ceil(diffMs / (60 * 1000));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${mins > 0 ? `and ${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
    }
  }, [lockedUntil]);

  return {
    email,
    setEmail,
    otp,
    setOTP,
    isLoading,
    error,
    success,
    countdown,
    dailyAttempts,
    maxDailyAttempts: MAX_DAILY_ATTEMPTS,
    failedAttempts,
    lockedUntil,
    lockoutTimeRemaining: getLockoutTimeRemaining(),
    canResendOTP: canResendOTP(),
    handleSendOTP,
    handleSubmit,
    handleChange,
    isValid,
    isInvalid
  }
} 