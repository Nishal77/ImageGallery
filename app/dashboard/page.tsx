'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { updateUserAfterOAuthLogin } from '@/lib/server-actions'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          throw error || new Error('User not found')
        }
        
        // If user logged in with OAuth, ensure their status is set to active
        if (user.app_metadata?.provider === 'google') {
          await updateUserAfterOAuthLogin(user.id)
        }
        
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase.auth])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome to Sentia</h1>
          <Button
            variant="outline"
            className="border-zinc-700 text-white hover:bg-zinc-800"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription className="text-zinc-400">
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-400">Status</label>
              <p className="text-white capitalize">{user?.user_metadata?.status || 'Active'}</p>
            </div>
            <div>
              <label className="text-sm text-zinc-400">Last Sign In</label>
              <p className="text-white">
                {user?.user_metadata?.last_sign_in 
                  ? new Date(user.user_metadata.last_sign_in).toLocaleString()
                  : 'N/A'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Total Memories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Shared With You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 