import { createBrowserClient } from "@supabase/ssr";

let supabaseSingleton: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("Supabase browser client must be used in the browser");
  }
  if (!supabaseSingleton) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      throw new Error("Your project's URL and Key are required to create a Supabase client!");
    }
    supabaseSingleton = createBrowserClient(url, anon);
  }
  return supabaseSingleton;
}
