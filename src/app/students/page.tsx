"use client";

import { useEffect } from "react";
import DebateNavbar from "@/components/DebateMatch/DebateNavbar";
import StudentsHero from "@/components/DebateMatch/StudentsHero";
import CoachMarketplace from "@/components/DebateMatch/CoachMarketplace";
import SuccessStories from "@/components/DebateMatch/SuccessStories";
import Footer from "@/components/Marketing/Footer";

export default function StudentsLandingPage() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('🔄 OAUTH CODE DETECTED: Redirecting to auth callback');
      // Redirect OAuth codes to the proper callback handler
      window.location.href = `/auth/callback${window.location.search}`;
      return;
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-white">
      <DebateNavbar />
      <StudentsHero />
      <CoachMarketplace />
      <SuccessStories />
      <Footer />
    </main>
  );
}
