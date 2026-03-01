"use client";

import DebateNavbar from "@/components/DebateMatch/DebateNavbar";
import Footer from "@/components/Marketing/Footer";
import ClusionMission from "@/components/DebateMatch/Mission";

export default function MissionPage() {
  return (
    <main className="relative min-h-screen bg-white">
      <DebateNavbar />
      <div className="pt-16">
        <ClusionMission />
      </div>
      <Footer />
    </main>
  );
}