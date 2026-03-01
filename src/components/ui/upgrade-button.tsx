"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreditCard } from "lucide-react"

interface UpgradeButtonProps {
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  children?: React.ReactNode
}

export function UpgradeButton({ 
  onClick, 
  className, 
  size = "md", 
  showIcon = true,
  children 
}: UpgradeButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        "bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden group",
        sizeClasses[size],
        className
      )}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {showIcon && <CreditCard className="h-4 w-4" />}
        <span>{children || "Upgrade to Premium"}</span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
    </Button>
  )
}
