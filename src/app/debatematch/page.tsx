"use client";

import { useEffect } from "react";
import DebateNavbar from "@/components/DebateMatch/DebateNavbar";
import DebateHero from "@/components/DebateMatch/DebateHero";
import Spotlight from "@/components/Marketing/Spotlight";
import Marquee from "@/components/Marketing/Marquee";
import LiveDemo from "@/components/Marketing/LiveDemo";
import Outcomes from "@/components/Marketing/Outcomes";
import Features from "@/components/Marketing/Features";
import Testimonials from "@/components/Marketing/Testimonials";
import Pricing from "@/components/Marketing/Pricing";
import FAQ from "@/components/Marketing/FAQ";
import Footer from "@/components/Marketing/Footer";

export default function DebateMatchLanding() {
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
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-cyan-50/40" />
      <div className="fixed inset-0 notebook-lines opacity-30" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-green-100/20" />
      
      <Spotlight />
      <DebateNavbar />
      <DebateHero />
      <Marquee />
      <LiveDemo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
