"use client";

import * as React from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const supabase = createSupabaseBrowserClient();
  
  // Get the next parameter from URL to redirect after auth
  const getNextUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('next') || '';
    }
    return '';
  };

  const handleLogin = async (nextUrl: any) => {
    // Only use localhost if we're in development mode AND accessing from localhost
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocalhost = location.hostname === 'localhost' || 
                       location.hostname === '127.0.0.1' ||
                       location.origin.includes('localhost');
    
    let redirectOrigin = location.origin;
    
    // Only redirect to localhost if we're in development AND accessing from localhost
    if (isDevelopment && isLocalhost) {
      redirectOrigin = 'http://localhost:3000';
    }
    
    const redirectUrl = nextUrl 
      ? `${redirectOrigin}/auth/callback?next=${encodeURIComponent(nextUrl)}`
      : `${redirectOrigin}/auth/callback`;
    
    console.log('🚀 OAUTH SETUP:', {
      isDevelopment,
      isLocalhost,
      currentOrigin: location.origin,
      redirectOrigin,
      redirectUrl,
      nextUrl,
      locationHostname: location.hostname,
      locationHref: location.href
    });

    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    console.log('🚀 OAUTH RESULT:', result);
  };
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    handleLogin(getNextUrl());

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={onSubmit}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
