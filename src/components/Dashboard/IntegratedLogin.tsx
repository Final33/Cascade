"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";
import PrepsyLogo from "@/components/PrepsyLogo";

interface IntegratedLoginProps {
  onAuthSuccess?: () => void;
  isCollapsed?: boolean;
}

const IntegratedLogin = ({ onAuthSuccess, isCollapsed = false }: IntegratedLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);

  useEffect(() => {
    // Initialize Supabase client only on the client side
    setSupabase(createSupabaseBrowserClient());
  }, []);

  const handleLogin = async () => {
    if (!supabase) return;
    
    setIsLoading(true);
    
    try {
      // Get current URL for redirect
      const isLocalhost = location.hostname === 'localhost' || 
                         location.hostname === '127.0.0.1' ||
                         location.origin.includes('localhost');
      
      let redirectOrigin = location.origin;
      if (isLocalhost) {
        redirectOrigin = 'http://localhost:3000';
      }
      
      const redirectUrl = `${redirectOrigin}/auth/callback`;
      
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (result.error) {
        console.error('OAuth error:', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <div className="flex items-center justify-center">
          <PrepsyLogo collapsed={true} />
        </div>
        
        <Button
          onClick={handleLogin}
          disabled={isLoading}
                      className={cn(
              "w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 hover:scale-[1.02] hover:-translate-y-0.5",
              "flex items-center justify-center font-bold"
            )}
        >
          {isLoading ? (
            <Icons.spinner className="h-5 w-5 animate-spin" />
          ) : (
            <Icons.google className="h-5 w-5" />
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Sign in to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Main Content Area - Centered like crackd */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="mb-8">
          <PrepsyLogo />
        </div>

        {/* Main heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          login or sign up below to get started!
        </h1>

        {/* Login Button - Matching crackd's blue style */}
        <div className="w-full max-w-sm mb-6">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className={cn(
              "w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-base",
              "flex items-center justify-center gap-3"
            )}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="h-5 w-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Icons.google className="h-5 w-5" />
                <span>Login with Google</span>
              </>
            )}
          </Button>
        </div>

        {/* Alternative login link */}
        <div className="mb-8">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
            Can't login with Google?
          </button>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            By signing up, you agree to the{" "}
            <a 
              href="/tos" 
              className="text-blue-600 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            {" "}and{" "}
            <a 
              href="/tos" 
              className="text-blue-600 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Bottom rating section */}
      {/* <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <span className="text-sm font-medium text-gray-700">Rated 4.9</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">by students</span>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 11.986c0-2.178-1.749-3.927-3.927-3.927s-3.927 1.749-3.927 3.927c0 2.178 1.749 3.927 3.927 3.927s3.927-1.749 3.927-3.927zM21.117 19.027c-0.505-0.505-1.325-0.505-1.83 0l-2.5 2.5c-0.505 0.505-0.505 1.325 0 1.83s1.325 0.505 1.83 0l2.5-2.5c0.505-0.505 0.505-1.325 0-1.83zM19.027 8.73c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 1.894 0.66 3.63 1.76 5.007l-2.934 2.934c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.934-2.934c1.377 1.1 3.113 1.76 5.007 1.76 4.418 0 8-3.582 8-8z"/>
            </svg>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default IntegratedLogin;
