'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { SignInWithGoogleButton } from "@/components/auth/SignInWithGoogleButton"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useOtpForm } from '@/lib/hooks/use-otp-form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function LoginPage() {
  const {
    email,
    setEmail,
    otp,
    setOTP: handleChange,
    isLoading,
    error,
    success,
    countdown,
    canResendOTP,
    handleSendOTP,
    handleSubmit,
    dailyAttempts,
    maxDailyAttempts,
    lockoutTimeRemaining,
    isValid,
    isInvalid,
  } = useOtpForm()

  const handleOTPComplete = () => {
    if (otp.length === 6) {
      handleSubmit(new Event('submit') as any)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6 text-white" />
            </div>
            <span className="sr-only">Sentia</span>
          </a>
          <h1 className="text-xl font-bold text-white">Yoo! Welcome back</h1>
          <div className="text-center text-sm text-zinc-400">
            Unable to login?{" "}
            <a href="mailto:2024mca039@mite.ac.in" className="text-white underline underline-offset-4 hover:text-zinc-300">
              Contact the administrator
            </a>
          </div>
        </div>

        <div className="space-y-6">
          {!success ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-400">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={!!isLoading || !canResendOTP || !email}
                className="w-full bg-white text-black hover:bg-zinc-200"
              >
                {isLoading ? 'Sending...' : 'Continue with Email'}
              </Button>
            </form>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <Label className="text-zinc-400">Enter one-time code to use Sentia</Label>
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
          )}

          {!success && (
            <>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-zinc-700"></div>
                <span className="mx-4 text-sm text-zinc-400">Or continue with</span>
                <div className="flex-grow border-t border-zinc-700"></div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" className="w-full border border-[#FAFAFA] text-white bg-[#09090B] hover:bg-[#1d1d1d]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Apple
                </Button>
                <SignInWithGoogleButton />
              </div>
            </>
          )}
        </div>

        <div className="text-balance text-center text-xs text-zinc-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white">
          By clicking continue, you agree to our <a href="/terms">Terms of Service</a>{" "}
          and <a href="/privacy">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
} 