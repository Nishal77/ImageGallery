import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        async setAll(cookiesToSet) {
          try {
            const resolvedCookieStore = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) => 
              resolvedCookieStore.set(name, value, options)
            );
          } catch {
            // This can happen when cookies are manipulated from a Server Component
            // or when the response has already been sent
          }
        },
      },
    }
  );
}; 