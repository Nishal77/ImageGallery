'use client'

import { useOtpForm } from '@/lib/hooks/use-otp-form'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Label } from './ui/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from '@/lib/utils'

interface OTPFormProps {
  email: string
}

export function OTPForm({ email }: OTPFormProps) {
  const {
    otp,
    setOTP: handleChange,
    isLoading,
    error,
    success,
    countdown,
    dailyAttempts,
    maxDailyAttempts,
    failedAttempts,
    lockoutTimeRemaining,
    canResendOTP,
    handleSendOTP,
    handleSubmit,
    isValid,
    isInvalid,
  } = useOtpForm()

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(e)
    }} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center">
          <Label className="text-zinc-400 text-base">Enter one-time code to use Sentia</Label>
        </div>
        <div className="flex justify-center mt-6">
          <InputOTP 
            value={otp} 
            onChange={handleChange} 
            maxLength={6} 
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className={cn(
                isValid && "border-green-500 text-green-500",
                isInvalid && "border-red-500"
              )} />
              <InputOTPSlot index={1} className={cn(
                isValid && "border-green-500 text-green-500",
                isInvalid && "border-red-500"
              )} />
              <InputOTPSlot index={2} className={cn(
                isValid && "border-green-500 text-green-500",
                isInvalid && "border-red-500"
              )} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className={cn(
                isValid && "border-green-500 text-green-500",
                isInvalid && "border-red-500"
              )} />
              <InputOTPSlot index={4} className={cn(
                isValid && "border-green-500 text-green-500",
                isInvalid && "border-red-500"
              )} />
              <InputOTPSlot index={5} className={cn(
                isValid && "border-green-500 text-green-500",
                isInvalid && "border-red-500"
              )} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Status messages */}
        <div className="text-center text-sm">
          {isValid && !error && (
            <p className="text-green-500 font-medium">Code verified successfully</p>
          )}
          
          {isInvalid && !error && (
            <p className="text-red-500 font-medium">Incorrect code, please try again</p>
          )}
        </div>
        
        {/* OTP attempts information */}
        <div className="text-center text-sm text-zinc-500">
          {dailyAttempts > 0 && (
            <p>Attempts used today: {dailyAttempts}/{maxDailyAttempts}</p>
          )}
          
          {countdown > 0 && (
            <p>Resend code in {countdown}s</p>
          )}
          
          {lockoutTimeRemaining && (
            <p className="text-amber-500 mt-1">
              Account locked for {lockoutTimeRemaining} due to too many failed attempts.
            </p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/50 border-green-800 text-white">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isLoading || otp.length !== 6 || !!lockoutTimeRemaining}
        className="w-full bg-white text-black hover:bg-zinc-200"
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-zinc-400 hover:text-white"
        disabled={!canResendOTP || isLoading}
        onClick={() => handleSendOTP(new Event('submit') as any)}
      >
        Resend Code
      </Button>
    </form>
  )
} 