"use client"

import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"


interface BetaOverlayProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
}



const BetaOverlay = ({ isOpen, onClose, featureName }: BetaOverlayProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative z-10 mx-4 max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Icon */}
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            prepsy :)
          </h2>

          {/* Beta message */}
          <p className="text-gray-600 mb-2 text-lg">
            prepsy is currently in beta
          </p>
          
          <p className="text-gray-500 mb-6">
            <span className="font-medium text-blue-600">{featureName}</span> will come out soon!
          </p>

          {/* Action button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  )
}



export default BetaOverlay
