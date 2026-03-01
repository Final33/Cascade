import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  
  try {
    const supabase = createSupabaseServerClient();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }
    
    // Create response with redirect
    const response = NextResponse.redirect(`${url.origin}/`);
    
    // Clear any auth-related cookies
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    
    return response;
  } catch (e) {
    console.error('Logout error:', e);
    // Even if there's an error, redirect to home
    return NextResponse.redirect(`${url.origin}/`);
  }
}


