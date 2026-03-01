import { createSupabaseBrowserClient } from './browser-client'

export interface ImageUploadResult {
  url: string
  path: string
  error?: string
}

/**
 * Upload an image to Supabase storage for FRQ stimulus
 */
export async function uploadFRQImage(
  file: File,
  frqId?: string
): Promise<ImageUploadResult> {
  try {
    const supabase = createSupabaseBrowserClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileName = frqId 
      ? `${frqId}-${timestamp}-${randomString}.${fileExt}`
      : `frq-${timestamp}-${randomString}.${fileExt}`
    
    const filePath = `frq-stimuli/${fileName}`
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.')
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload images smaller than 5MB.')
    }
    
    // Optimize image if needed (compress large images)
    const optimizedFile = await optimizeImage(file)
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('frq-images')
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('frq-images')
      .getPublicUrl(filePath)
    
    return {
      url: publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete an image from Supabase storage
 */
export async function deleteFRQImage(imagePath: string): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient()
    
    const { error } = await supabase.storage
      .from('frq-images')
      .remove([imagePath])
    
    if (error) {
      console.error('Delete error:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Image delete error:', error)
    return false
  }
}

/**
 * Extract file path from Supabase public URL
 */
export function extractImagePath(publicUrl: string): string {
  try {
    const url = new URL(publicUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === 'frq-images')
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/')
    }
    
    return ''
  } catch {
    return ''
  }
}

/**
 * Optimize image for web (compress and resize if needed)
 */
async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px width/height)
      const maxDimension = 1200
      let { width, height } = img
      
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(optimizedFile)
          } else {
            resolve(file) // Fallback to original if optimization fails
          }
        },
        file.type,
        0.85 // 85% quality
      )
    }
    
    img.onerror = () => {
      resolve(file) // Fallback to original if image loading fails
    }
    
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
  }
  
  if (file.size > maxSize) {
    return 'File size must be less than 5MB'
  }
  
  return null
}

/**
 * Check if user has permission to upload images (admin only)
 */
export async function checkUploadPermission(): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    const { data: userData } = await supabase
      .from('users')
      .select('admin')
      .eq('uid', user.id)
      .single()
    
    return userData?.admin === true
  } catch {
    return false
  }
}
