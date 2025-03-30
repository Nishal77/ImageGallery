'use client'

import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  isValid?: boolean
  isInvalid?: boolean
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  isValid = false,
  isInvalid = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const getBorderColor = (isFocused: boolean) => {
    if (isValid) return 'border-green-500'
    if (isInvalid) return 'border-red-500'
    if (isFocused) return 'border-blue-500'
    return 'border-zinc-700'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    if (!newValue) return

    const newOTP = value.split('')
    newOTP[index] = newValue[0]
    onChange(newOTP.join(''))

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '')
    const newValue = pastedData.slice(0, length)
    onChange(newValue.padEnd(length, ''))
  }

  const setRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el
  }

  return (
    <div className="inline-flex rounded-lg bg-zinc-800/50 p-1">
      {Array.from({ length }, (_, i) => (
        <div key={i} className="relative">
          <input
            ref={setRef(i)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'w-10 h-12 text-center text-lg font-medium',
              'bg-transparent text-white',
              'focus:outline-none focus:ring-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-zinc-600',
              i === 0 && 'rounded-l-md',
              i === length - 1 && 'rounded-r-md',
              i !== length - 1 && 'border-r border-zinc-700'
            )}
          />
        </div>
      ))}
    </div>
  )
} 