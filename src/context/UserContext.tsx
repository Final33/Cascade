"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: string;
  onboarded: boolean;
  plan: string;
  admin: boolean;
  apclasses: string[];
  additional_info: string;
  version: number;
  tokens_used: number;
  gpt_4_tokens_used: number;
  gpt_3_tokens_used: number;
  gpt_version: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  stripe_current_period_end: string;
  toured: boolean;
  consultant_thread_id: string;
  created_at: string;
  referred_by: string;
  referrer: string;
  invited_tokens: number;
  login_times: string[];
}

export const UserContext = createContext<{
  userData: User | null;
  refreshUserData: () => void;
}>({
  userData: null,
  refreshUserData: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserData = async () => {
    if (!mounted) return;
    
    try {
      const supabase = createSupabaseBrowserClient();
      const session = await supabase.auth.getSession();
      if (session.data.session?.user.id) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("uid", session.data.session.user.id);

        if (data && data.length > 0) {
          setUserData(data[0] as unknown as User);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchUserData();
    }
  }, [mounted]);

  const refreshUserData = () => {
    fetchUserData();
  };

  return (
    <UserContext.Provider value={{ userData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
