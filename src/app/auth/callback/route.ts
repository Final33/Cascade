import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  // if "next" is in param, use it in the redirect URL
  const next = searchParams.get("next") ?? "";

  // CRITICAL: If this callback is hit on production but should go to localhost
  const requestHost = request.headers.get('host') || '';
  const referer = request.headers.get('referer') || '';
  
  if (code && !requestHost.includes('localhost') && referer.includes('localhost')) {
    console.log('🔄 CALLBACK REDIRECT: Production callback from localhost, redirecting to localhost');
    const localhostUrl = `http://localhost:3000/auth/callback?code=${code}&next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(localhostUrl);
  }

  if (code) {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure a user row exists for this authenticated user to avoid UI spinner loops
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let isNewUser = false;
      
      try {
        if (session?.user?.id) {
          console.log('🔍 CHECKING USER EXISTENCE:', session.user.id);
          
          const { data: userRow, error: selectError } = await supabase
            .from("users")
            .select("uid, onboarded")
            .eq("uid", session.user.id)
            .single();

          console.log('👤 USER QUERY RESULT:', { userRow, selectError });

          if (!userRow) {
            // This is a new user - create their record
            isNewUser = true;
            const timestamp = new Date().toISOString();
            
            console.log('🆕 CREATING NEW USER:', {
              uid: session.user.id,
              email: session.user.email,
              onboarded: false
            });
            
            const { error: insertError } = await supabase.from("users").insert({
              uid: session.user.id,
              name: session.user.user_metadata?.full_name ?? null,
              email: session.user.email,
              role: "user",
              onboarded: false,
              plan: "free",
              admin: false,
              apclasses: [],
              tokens_used: 0,
              created_at: timestamp,
              login_times: [timestamp],
            });
            
            if (insertError) {
              console.error('❌ USER INSERT ERROR:', insertError);
            } else {
              console.log('✅ USER CREATED SUCCESSFULLY');
            }
          } else {
            console.log('👤 EXISTING USER FOUND:', { 
              uid: userRow.uid, 
              onboarded: userRow.onboarded 
            });
          }
        }
      } catch (e) {
        // Fail open if RLS disallows insert/select; user can proceed
        console.error("❌ /auth/callback ensure user error", e);
      }

      // Check if user needs onboarding
      let targetPath = "/dashboard/home"; // Default path
      
      console.log('🎯 DETERMINING REDIRECT PATH:', {
        isNewUser,
        nextParam: next,
        sessionUserId: session?.user?.id
      });
      
      // If this is a new user (just created), redirect to onboarding
      if (isNewUser) {
        if (next === '/upgrade-new') {
          targetPath = "/onboarding?from=callback&redirect_to=upgrade-new";
          console.log('🆕 NEW USER FROM PRICING -> ONBOARDING WITH UPGRADE REDIRECT');
        } else {
          targetPath = "/onboarding?from=callback";
          console.log('🆕 NEW USER -> ONBOARDING');
        }
      } else {
        // Check if existing user still needs onboarding
        if (session?.user?.id) {
          const { data: existingUser, error: onboardingCheckError } = await supabase
            .from("users")
            .select("onboarded")
            .eq("uid", session.user.id)
            .single();
          
          console.log('🔍 ONBOARDING CHECK:', { 
            existingUser, 
            onboardingCheckError,
            needsOnboarding: existingUser && !existingUser.onboarded
          });
          
          if (existingUser && !existingUser.onboarded) {
            if (next === '/upgrade-new') {
              targetPath = "/onboarding?from=callback&redirect_to=upgrade-new";
              console.log('👤 EXISTING USER FROM PRICING -> ONBOARDING WITH UPGRADE REDIRECT');
            } else {
              targetPath = "/onboarding?from=callback";
              console.log('👤 EXISTING USER NEEDS ONBOARDING -> ONBOARDING');
            }
          } else if (next && next.startsWith("/")) {
            // Only use the next parameter if user is onboarded and it's a valid path
            targetPath = next;
            console.log('✅ ONBOARDED USER WITH NEXT PARAM -> ', next);
          } else {
            console.log('✅ ONBOARDED USER -> DASHBOARD');
          }
        }
      }
      
      // Determine the correct redirect origin
      const isDevelopment = process.env.NODE_ENV === 'development';
      const requestHost = request.headers.get('host') || '';
      const forwardedHost = request.headers.get('x-forwarded-host') || '';
      
      const isLocalhost = requestHost.includes('localhost') || 
                         forwardedHost.includes('localhost') ||
                         origin.includes('localhost');
      
      let redirectOrigin = origin;
      
      // Only redirect to localhost if we're actually in development mode AND accessing from localhost
      if (isDevelopment && isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      const finalRedirectUrl = `${redirectOrigin}${targetPath}`;
      
      console.log('🔄 AUTH CALLBACK REDIRECT:', {
        finalRedirectUrl,
        redirectOrigin,
        targetPath,
        isDevelopment,
        isLocalhost,
        origin,
        requestHost,
        forwardedHost,
        nodeEnv: process.env.NODE_ENV,
        nextParam: next,
        isNewUser,
        sessionUserId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      return NextResponse.redirect(finalRedirectUrl);
    }
  }

  // TODO: Create this page
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
