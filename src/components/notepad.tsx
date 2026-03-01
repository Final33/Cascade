"use client"

import * as React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Move } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotepadProps {
  isOpen: boolean
  onClose: () => void
}

export function Notepad({ isOpen, onClose }: NotepadProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [noteContent, setNoteContent] = useState("")
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 600, height: 400 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const maxCharacters = 1500
  const characterCount = noteContent.length

  const handleClose = () => {
    setNoteContent("") // Clear content when closing
    onClose()
  }

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
      
      const newWidth = Math.max(400, resizeStart.width + deltaX)
      const newHeight = Math.max(300, resizeStart.height + deltaY)
      
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
      
      // Keep notepad within viewport bounds with padding
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
        "fixed z-40 bg-white rounded-lg border border-gray-300 flex flex-col",
        (isDragging || isResizing) && "select-none",
        !isDragging && !isResizing && "transition-transform duration-150 ease-out"
      )}
      style={{
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isDragging ? 'scale(1.005) rotate(-0.2deg)' : 'scale(1) rotate(0deg)',
        willChange: (isDragging || isResizing) ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-t-lg cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          <h2 className="text-sm font-semibold">Notepad</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-white hover:bg-red-500 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Main Content - Simple Text Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <Textarea
            placeholder="Your notes here..."
            value={noteContent}
            onChange={(e) => {
              if (e.target.value.length <= maxCharacters) {
                setNoteContent(e.target.value)
              }
            }}
            className="w-full h-full resize-none border-none shadow-none focus:ring-0 text-base leading-relaxed bg-transparent"
            style={{ outline: 'none' }}
          />
        </div>
        
        {/* Character Counter */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {characterCount}/{maxCharacters} characters
          </div>
        </div>
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
