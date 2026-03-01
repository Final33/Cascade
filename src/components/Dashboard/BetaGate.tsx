"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface BetaGateProps {
  featureName?: string;
  className?: string;
  children?: React.ReactNode;
  isAdmin?: boolean;
}

const BetaGate = ({ 
  featureName = "Feature", 
  className,
  children,
  isAdmin = false
}: BetaGateProps) => {
  // If user is admin, show content directly without beta gate
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Background content (blurred) */}
      <div className="filter blur-[1px] brightness-90 pointer-events-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[0.5px] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-8">
          <div className="text-center">
            
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
              <span className="text-green-600">prep</span><span className="text-blue-600">sy :)</span>
            </h1>
            
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Beta Feature
            </h2>
            
            <p className="text-gray-600 text-base">
              <span className="font-medium text-blue-600">{featureName}</span> is coming out soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaGate;
