'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendOTP, verifyOTP } from "@/lib/auth-actions";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Auto-submit OTP when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp(new Event('submit') as any);
    }
  }, [otp]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpInput && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setMessage({
        type: 'error',
        text: 'OTP has expired. Please request a new one.',
      });
      setShowOtpInput(false);
      setOtp('');
      setTimeLeft(30);
    }
    return () => clearInterval(timer);
  }, [showOtpInput, timeLeft]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await sendOTP(email);
      setMessage({
        type: 'success',
        text: 'Check your email for the verification code!',
      });
      setShowOtpInput(true);
      setTimeLeft(30);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    setMessage(null);

    try {
      await verifyOTP(email, otp);
      setMessage({
        type: 'success',
        text: 'Successfully logged in!',
      });
      // Redirect or handle successful login
      window.location.href = '/';
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Invalid verification code. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setOtp(numericValue);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {!showOtpInput ? (
        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-zinc-400 text-center">
              Enter the 6-digit code sent to your email
              <br />
              <span className="text-xs text-red-500">
                Expires in {timeLeft} seconds
              </span>
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={loading || timeLeft === 0}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading || otp.length !== 6 || timeLeft === 0}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-zinc-400 hover:text-white"
            onClick={() => {
              setShowOtpInput(false);
              setOtp('');
              setTimeLeft(30);
            }}
          >
            Back to email
          </Button>
        </form>
      )}
    </div>
  );
} 