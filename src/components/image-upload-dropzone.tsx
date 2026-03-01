'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ImageUploadDropzoneProps {
  onImageUpload: (file: File) => Promise<string>
  currentImageUrl?: string
  onImageRemove?: () => void
  maxFileSize?: number // in bytes, default 5MB
  acceptedTypes?: string[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function ImageUploadDropzone({
  onImageUpload,
  currentImageUrl,
  onImageRemove,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  placeholder = 'Drag & drop an image here, or click to select',
  className,
  disabled = false
}: ImageUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Please upload a valid image file (${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')})`
    }
    
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024))
      return `File size must be less than ${maxSizeMB}MB`
    }
    
    return null
  }, [acceptedTypes, maxFileSize])

  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)
    setUploadProgress(0)
    setSuccess(false)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const imageUrl = await onImageUpload(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setSuccess(true)
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onImageUpload, validateFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [disabled, handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }, [handleFileUpload])

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const handleRemove = useCallback(() => {
    if (onImageRemove) {
      onImageRemove()
      setError(null)
      setSuccess(false)
    }
  }, [onImageRemove])

  // If there's a current image, show the preview
  if (currentImageUrl) {
    return (
      <div className={cn("relative group", className)}>
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={currentImageUrl}
            alt="Uploaded stimulus"
            className="w-full h-48 object-contain bg-white"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.svg' // Fallback image
            }}
          />
          
          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Replace button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleClick}
            disabled={disabled || isUploading}
          >
            <Upload className="w-4 h-4 mr-1" />
            Replace
          </Button>
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        {/* Upload progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-4 rounded-lg min-w-48">
              <div className="text-sm font-medium mb-2">Uploading...</div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <Alert className="mt-2 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Image uploaded successfully!
            </AlertDescription>
          </Alert>
        )}
        
        {/* Error message */}
        {error && (
          <Alert className="mt-2 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  // Show upload dropzone
  return (
    <div className={cn("relative", className)}>
      <div
        ref={dropzoneRef}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          "hover:border-blue-400 hover:bg-blue-50",
          isDragOver && "border-blue-500 bg-blue-100",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-300 bg-red-50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload image"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-medium text-gray-900 mb-2">
                Uploading image...
              </div>
              <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
              <div className="text-sm text-gray-600 mt-1">{uploadProgress}%</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-lg flex items-center justify-center mx-auto",
              isDragOver ? "bg-blue-200" : "bg-gray-100"
            )}>
              <ImageIcon className={cn(
                "w-8 h-8",
                isDragOver ? "text-blue-700" : "text-gray-400"
              )} />
            </div>
            <div>
              <div className="text-lg font-medium text-gray-900 mb-2">
                {isDragOver ? 'Drop image here' : placeholder}
              </div>
              <p className="text-sm text-gray-600">
                {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {Math.round(maxFileSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Error message */}
      {error && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Success message */}
      {success && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Image uploaded successfully!
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
