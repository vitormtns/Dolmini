import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function createSupabaseServerClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase public env vars are not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options: CookieOptions;
          }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components can read cookies, but Next.js only allows cookie
            // writes in Server Actions, Route Handlers, or middleware. Session
            // refresh writes are handled by middleware when this path is read-only.
          }
        }
      }
    }
  );
}
