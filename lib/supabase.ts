import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key'

// Singleton: reuse a single client instance across the entire app (avoids
// multiple WebSocket connections during hot-reload in development).
declare global {
  // eslint-disable-next-line no-var
  var __supabaseClient: ReturnType<typeof createClient> | undefined
}

const client =
  globalThis.__supabaseClient ??
  (globalThis.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }))

// Export with modified 'from' signature to prevent 'never' inference
// on table operations, while preserving 'auth' and other methods' types.
export const supabase = client as Omit<typeof client, 'from'> & {
  from: (table: string) => any
}
