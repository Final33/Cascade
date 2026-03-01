"use client"

import * as React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { X, Maximize2, Minimize2, Move } from "lucide-react"
import { cn } from "@/lib/utils"

interface DesmosCalculatorProps {
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (element: HTMLElement, options?: any) => any
    }
  }
}

export function DesmosCalculator({ isOpen, onClose }: DesmosCalculatorProps) {
  const calculatorRef = useRef<HTMLDivElement>(null)
  const calculatorInstance = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [size, setSize] = useState({ width: 500, height: 400 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!isOpen) return

    const loadDesmos = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if Desmos is already loaded
        if (window.Desmos) {
          initializeCalculator()
          return
        }

        // Load Desmos API script with API key
        const script = document.createElement('script')
        const apiKey = process.env.NEXT_PUBLIC_DESMOS_KEY || ''
        script.src = `https://www.desmos.com/api/v1.11/calculator.js${apiKey ? `?apiKey=${apiKey}` : ''}`
        script.async = true
        
        script.onload = () => {
          initializeCalculator()
        }
        
        script.onerror = () => {
          setError('Failed to load Desmos calculator. Please check your internet connection.')
          setIsLoading(false)
        }

        document.head.appendChild(script)

        return () => {
          document.head.removeChild(script)
        }
      } catch (err) {
        setError('Failed to initialize Desmos calculator.')
        setIsLoading(false)
      }
    }

    const initializeCalculator = () => {
      if (calculatorRef.current && window.Desmos) {
        try {
          // Clear any existing calculator
          if (calculatorInstance.current) {
            calculatorInstance.current.destroy()
          }

          // Create new calculator instance
          calculatorInstance.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
            keypad: true,
            graphpaper: true,
            expressions: true,
            settingsMenu: true,
            zoomButtons: true,
            expressionsTopbar: true,
            pointsOfInterest: true,
            trace: true,
            border: false,
            lockViewport: false,
            expressionsCollapsed: false,
            images: false,
            folders: true,
            notes: true,
            sliders: true,
            qwertyKeyboard: true,
            restrictedFunctions: false
          })

          setIsLoading(false)
        } catch (err) {
          setError('Failed to create calculator instance.')
          setIsLoading(false)
        }
      }
    }

    loadDesmos()

    return () => {
      if (calculatorInstance.current) {
        calculatorInstance.current.destroy()
        calculatorInstance.current = null
      }
    }
  }, [isOpen])

  // Resize functionality
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
    
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'nw-resize'
  }, [size])

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    
    e.preventDefault()
    
    requestAnimationFrame(() => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      const newWidth = Math.max(300, resizeStart.width + deltaX)
      const newHeight = Math.max(250, resizeStart.height + deltaY)
      
      // Keep within viewport bounds
      const maxWidth = window.innerWidth - position.x - 20
      const maxHeight = window.innerHeight - position.y - 20
      
      setSize({
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight)
      })
    })
  }, [isResizing, resizeStart, position])

  const handleResizeEnd = useCallback(() => {
    if (!isResizing) return
    
    setIsResizing(false)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    
    // Trigger Desmos resize after resize ends
    setTimeout(() => {
      if (calculatorInstance.current) {
        calculatorInstance.current.resize()
      }
    }, 100)
  }, [isResizing])

  // Drag functionality with smooth performance
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    
    // Add user-select: none to prevent text selection during drag
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    e.preventDefault()
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Keep calculator within viewport bounds with padding
      const padding = 10
      const maxX = window.innerWidth - size.width - padding
      const maxY = window.innerHeight - size.height - padding
      
      setPosition({
        x: Math.max(padding, Math.min(newX, maxX)),
        y: Math.max(padding, Math.min(newY, maxY))
      })
    })
  }, [isDragging, dragStart, size])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Restore normal cursor and text selection
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      // Use passive: false for better performance and preventDefault capability
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp, { passive: false })
      
      // Also handle mouse leave to prevent stuck drag state
      document.addEventListener('mouseleave', handleMouseUp, { passive: false })
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mouseleave', handleMouseUp)
        
        // Cleanup styles
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove, { passive: false })
      document.addEventListener('mouseup', handleResizeEnd, { passive: false })
      document.addEventListener('mouseleave', handleResizeEnd, { passive: false })
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.removeEventListener('mouseleave', handleResizeEnd)
        
        // Cleanup styles
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  if (!isOpen) return null

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed z-50 bg-white rounded-lg border border-gray-300 flex flex-col",
        (isDragging || isResizing) && "select-none",
        !isDragging && !isResizing && "transition-transform duration-150 ease-out"
      )}
      style={{
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isDragging ? 'scale(1.005) rotate(0.2deg)' : 'scale(1) rotate(0deg)',
        willChange: (isDragging || isResizing) ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-500 text-white rounded-t-lg cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          <h2 className="text-sm font-semibold">Desmos Calculator</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-red-500 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="flex-1 p-2 overflow-hidden bg-gray-50">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading calculator...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-2 text-sm">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          </div>
        )}
        
        <div 
          ref={calculatorRef} 
          className={cn(
            "w-full h-full rounded",
            (isLoading || error) && "hidden"
          )}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-blue-500 opacity-50 hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeStart}
        style={{
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
        }}
      />
    </div>
  )
}
