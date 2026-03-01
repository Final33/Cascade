"use client";

import React, { ReactNode, useState, useEffect, Suspense, lazy } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import Sidebar from "@/components/Dashboard/Sidebar";
import SidebarSkeleton from "@/components/Dashboard/SidebarSkeleton";
import { useRouter, usePathname } from "next/navigation";
import Intercom from "@intercom/messenger-js-sdk";

interface UserNavProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: UserNavProps) {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Hide sidebar for fire surveillance dashboard (home page)
  const showSidebar = pathname !== '/dashboard/home';

  useEffect(() => {
    // Initialize Supabase client on the client side only
    const client = createSupabaseBrowserClient();
    setSupabase(client);
  }, []);

  useEffect(() => {
    if (supabase) {
      getUserData();
    }
  }, [supabase]);

  async function getUserData() {
    if (!supabase) return;
    
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess?.session?.user?.id;
      const email = sess?.session?.user?.email ?? "";
      
      if (!uid) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid);

      if (data && data.length > 0) {
        setUserData(data[0]);
        try { window.clarity && window.clarity("identify", email); } catch {}
        
        // Check for pricing redirect after successful authentication
        const pricingRedirect = sessionStorage.getItem('pricing_redirect');
        if (pricingRedirect) {
          sessionStorage.removeItem('pricing_redirect');
          router.push(pricingRedirect);
          return;
        }
      } else {
        setUserData({ uid, email, plan: "free", onboarded: true });
      }
    } catch (err) {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess?.session?.user?.id ?? "";
      const email = sess?.session?.user?.email ?? "";
      
      if (uid) {
        setIsAuthenticated(true);
        setUserData({ uid, email, plan: "free", onboarded: true });
        
        // Check for pricing redirect after successful authentication
        const pricingRedirect = sessionStorage.getItem('pricing_redirect');
        if (pricingRedirect) {
          sessionStorage.removeItem('pricing_redirect');
          router.push(pricingRedirect);
          return;
        }
      } else {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserData(null);
    router.refresh();
  }

  const LazyChildren = lazy(() =>
    Promise.resolve({ default: () => <>{children}</> })
  );

  const showFreeIcon = (userData?.plan ?? "free") !== "free";

  // Always show the dashboard - authentication is handled in the sidebar
  return (
    <div className="flex h-screen w-screen">
      {showSidebar && (
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar 
          userData={userData} 
          isLoading={isLoading} 
          isAuthenticated={isAuthenticated}
          onCollapseChange={setIsSidebarCollapsed}
          onAuthSuccess={getUserData}
        />
      </Suspense>
      )}
      
      <div className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${showSidebar ? (isSidebarCollapsed ? 'md:ml-28' : 'md:ml-64') : 'ml-0'}
        `}>
        <main className="flex-1 overflow-hidden bg-slate-50 relative">
          {showSidebar && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-green-50/15 to-cyan-50/20 pointer-events-none" />
          )}
          <div className="h-full overflow-y-auto relative z-10">
            <Suspense fallback={
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
