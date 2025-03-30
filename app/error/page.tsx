'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GalleryVerticalEnd } from 'lucide-react'

function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('code')

  useEffect(() => {
    // Automatically redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-500/10">
            <GalleryVerticalEnd className="size-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Authentication Error</h1>
          <p className="text-center text-zinc-400">
            We encountered an issue while trying to sign you in.
            {errorCode && <span className="block mt-2">Error code: {errorCode}</span>}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-white text-black hover:bg-zinc-200"
          >
            Return to Login
          </Button>
          <p className="text-center text-sm text-zinc-500">
            You will be automatically redirected in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold text-white">Authentication Error</h1>
            <p className="text-center text-zinc-400">Loading error details...</p>
          </div>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
} 