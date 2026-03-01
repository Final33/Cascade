import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseReqResClient,
  createSupabaseServerComponentClient,
} from "./lib/supabase/server-client";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "./lib/sendEmail";
import { documentData } from "./documentData";
import { SupabaseClient } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (
      pathname.startsWith('/auth/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/pricing') ||
      pathname.startsWith('/tos') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/upgrade-new') ||
      pathname.startsWith('/upgrade') ||
      pathname.startsWith('/mission') ||
      pathname.startsWith('/free-tutoring')
    ) {
      return NextResponse.next();
    }


    const envUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const envAnon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!envUrl || !envAnon) {
      return NextResponse.next();
    }

    const response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createSupabaseReqResClient(request, response);
    const {
      data: { session },
    } = await supabase.auth.getSession();

  const currentUrl = new URL(request.url);
  const refCode = currentUrl.searchParams.get("ref");

  if (!session) {
    if (pathname === "/") {
      if (refCode) {
        console.log("Ref code:", refCode);
        const response = NextResponse.next();
        response.cookies.set("refCode", refCode, {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
        });
        return response;
      }
      return NextResponse.next();
    }
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                       request.headers.get('x-forwarded-host')?.includes('localhost');
    
    let redirectOrigin = new URL(request.url).origin;
    
    // Only use localhost if we're in development AND accessing from localhost
    if (isDevelopment && isLocalhost) {
      redirectOrigin = 'http://localhost:3000';
    }
    
    const loginUrl = new URL(`${redirectOrigin}/login`);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const storedRefCode = request.cookies.get("refCode")?.value;
  if (storedRefCode) {
    try {
      await supabase.from('users').update({ referrer: storedRefCode }).eq('uid', session.user.id);
      response.cookies.delete("refCode");
    } catch (e) {
      console.error('Failed to update user with ref code', e);
    }
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("uid", session.user.id)
    .single();

  if (!userData) {
    await createNewUser(supabase, session);
    if (pathname === "/" && session) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                         request.headers.get('x-forwarded-host')?.includes('localhost');
      
      let redirectOrigin = new URL(request.url).origin;
      
      // Only use localhost if we're in development AND accessing from localhost
      if (isDevelopment && isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      return NextResponse.redirect(`${redirectOrigin}/onboarding`);
    }
  } else {
    const { admin, onboarded, plan, stripe_current_period_end } = userData;

    // Redirect authenticated users from root to home
    if (pathname === "/" && session) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                         request.headers.get('x-forwarded-host')?.includes('localhost');
      
      let redirectOrigin = new URL(request.url).origin;
      
      // Only use localhost if we're in development AND accessing from localhost
      if (isDevelopment && isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      console.log('🏠 MIDDLEWARE: Redirecting authenticated user to home:', {
        redirectOrigin,
        targetUrl: `${redirectOrigin}/dashboard/home`,
        isDevelopment,
        isLocalhost,
        requestHost: request.headers.get('host'),
        forwardedHost: request.headers.get('x-forwarded-host'),
        originalUrl: request.url
      });
      
      return NextResponse.redirect(`${redirectOrigin}/dashboard/home`);
    }

    if (!admin && request.url.includes("admin")) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                         request.headers.get('x-forwarded-host')?.includes('localhost');
      
      let redirectOrigin = new URL(request.url).origin;
      
      // Only use localhost if we're in development AND accessing from localhost
      if (isDevelopment && isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      return NextResponse.redirect(`${redirectOrigin}/`);
    }

    if (request.url.includes("documents") && !admin) {
      const belongsToUser = await checkDocumentOwnership(
        supabase,
        session.user.id,
        request.url
      );
      if (!belongsToUser) {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                           request.headers.get('x-forwarded-host')?.includes('localhost');
        
        let redirectOrigin = new URL(request.url).origin;
        
        // Only use localhost if we're in development AND accessing from localhost
        if (isDevelopment && isLocalhost) {
          redirectOrigin = 'http://localhost:3000';
        }
        
        return NextResponse.redirect(`${redirectOrigin}/`);
      }
    }

    if (!onboarded && !request.url.includes("onboarding")) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                         request.headers.get('x-forwarded-host')?.includes('localhost');
      
      let redirectOrigin = new URL(request.url).origin;
      
      // Only use localhost if we're in development AND accessing from localhost
      if (isDevelopment && isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      return NextResponse.redirect(`${redirectOrigin}/onboarding`);
    }

    if (
      plan !== "free" &&
          stripe_current_period_end &&
    stripe_current_period_end !== null &&
    new Date(stripe_current_period_end) < new Date() &&
      !request.url.includes("pricing")
    ) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                         request.headers.get('x-forwarded-host')?.includes('localhost');
      
      let redirectOrigin = new URL(request.url).origin;
      
      // Only use localhost if we're in development AND accessing from localhost
      if (isDevelopment && isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      return NextResponse.redirect(`${redirectOrigin}/pricing`);
    }
  }

  if (session) {
    await updateLoginTime(supabase, session.user.id);
  }

    return response;
  } catch (err) {
    console.error('Middleware error:', err);
    // Fail open - don't block the request
    return NextResponse.next();
  }
}

async function updateLoginTime(supabase: SupabaseClient, userId: string) {
  const { data, error: fetchError } = await supabase
    .from("users")
    .select("login_times, last_activity_date")
    .eq("uid", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching login times:", fetchError);
    return;
  }

  const currentTime = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  
  // Ensure loginTimes is an array and contains valid timestamps
  let loginTimes = Array.isArray(data?.login_times) ? data.login_times : [];
  loginTimes = loginTimes.filter(time => typeof time === 'string');
  
  // Keep only the last 100 login times
  const updatedLoginTimes = [...loginTimes, currentTime].slice(-100);

  const { error: updateError } = await supabase
    .from("users")
    .update({ 
      login_times: updatedLoginTimes,
    })
    .eq("uid", userId);

  if (updateError) {
    console.error("Error updating login times:", updateError);
  }

  // Update daily activity and streak if this is the first login today
  const lastActivityDate = data?.last_activity_date;
  if (!lastActivityDate || lastActivityDate !== today) {
    try {
      // Call the database function to update daily activity and streak
      const { error: activityError } = await supabase.rpc('update_daily_activity_and_streak', {
        p_user_id: userId,
        p_questions_answered: 0,
        p_questions_correct: 0,
        p_practice_time_seconds: 0,
        p_tests_completed: 0
      });

      if (activityError) {
        console.error("Error updating daily activity on login:", activityError);
      } else {
        console.log("✅ Daily activity updated on login for user:", userId);
      }
    } catch (error) {
      console.error("Error calling daily activity function:", error);
    }
  }
}

export async function createNewUser(supabase: SupabaseClient, session: Session, initialTokens: number = 0) {
  const timestamp = new Date().toISOString();

  const { error: insertError } = await supabase
    .from("users")
    .insert({
      uid: session.user.id,
      name: session.user.user_metadata.full_name,
      email: session.user.email,
      role: 'user',
      onboarded: false,
      plan: 'free',
      admin: false,
      apclasses: [],
      tokens_used: 0,
      created_at: timestamp,
      login_times: [timestamp]
    });

  if (insertError) {
    console.error("Error creating new user:", insertError);
    throw insertError;
  }
}

async function checkDocumentOwnership(supabase: SupabaseClient, userId: string, url: string) {
  const { data: documents } = await supabase
    .from("documents")
    .select("id")
    .eq("user_id", userId);

  return (documents || []).some((doc: { id: string }) => url.includes(doc.id));
}

export async function checkUserPlan(req: NextRequest) {
  const supabase = createSupabaseServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data } = await supabase
      .from("users")
      .select("plan, tokens_used, invited_tokens")
      .eq("uid", session.user.id)
      .single();

    const totalAvailableTokens = 0 + ((data?.invited_tokens as number) || 0);

    if (data && data.plan !== "pro" && (data.tokens_used as number) >= totalAvailableTokens) {
      return NextResponse.json({ error: "Upgrade Required" }, { status: 403 });
    }
  }
  return NextResponse.next();
}


export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Also protect other authenticated routes
    "/onboarding/:path*",
    "/settings/:path*",
    "/profile/:path*",
    // Handle root path for authenticated users
    "/",
  ],
};
