import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCookie, setCookie } from "cookies-next";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// server component can only get cookies and not set them, hence the "component" check
export function createSupabaseServerClient(component: boolean = false) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase server env missing: set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_ variants)");
  }
  return createServerClient(
    url,
    anon,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
          cookies().set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          if (component) return;
          cookies().set(name, "", options);
        },
      },
    }
  );
}

export function createSupabaseServerComponentClient() {
  return createSupabaseServerClient(true);
}

export function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase server env missing: set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_ variants)");
  }
  return createServerClient(
    url,
    anon,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { req, res });
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options });
        },
        remove(name: string, options: CookieOptions) {
          setCookie(name, "", { req, res, ...options });
        },
      },
    }
  );
}
