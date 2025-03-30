'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Logging out...</h1>
        <p className="mt-2 text-zinc-400">You will be redirected shortly.</p>
      </div>
    </div>
  );
} 