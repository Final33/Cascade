-- FRQ Image Storage Setup for Supabase
-- This script creates storage bucket and policies for FRQ stimulus images

-- Create storage bucket for FRQ images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'frq-images',
  'frq-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload FRQ images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view FRQ images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update FRQ images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete FRQ images" ON storage.objects;

-- Set up RLS policies for FRQ image uploads
-- Policy 1: Admins can upload FRQ images
CREATE POLICY "Admins can upload FRQ images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'frq-images' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.uid = auth.uid() AND users.admin = true
  )
);

-- Policy 2: Anyone can view FRQ images (public read access)
CREATE POLICY "Anyone can view FRQ images" ON storage.objects
FOR SELECT USING (bucket_id = 'frq-images');

-- Policy 3: Admins can update FRQ images
CREATE POLICY "Admins can update FRQ images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'frq-images' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.uid = auth.uid() AND users.admin = true
  )
);

-- Policy 4: Admins can delete FRQ images
CREATE POLICY "Admins can delete FRQ images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'frq-images' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.uid = auth.uid() AND users.admin = true
  )
);

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create function to clean up orphaned images (optional utility)
CREATE OR REPLACE FUNCTION cleanup_orphaned_frq_images()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete images that are not referenced in frq_questions table
  DELETE FROM storage.objects
  WHERE bucket_id = 'frq-images'
  AND name NOT IN (
    SELECT DISTINCT SUBSTRING(stimulus_image_url FROM '[^/]+$')
    FROM frq_questions
    WHERE stimulus_image_url IS NOT NULL
    UNION
    SELECT DISTINCT SUBSTRING(stimulus_image_2_url FROM '[^/]+$')
    FROM frq_questions
    WHERE stimulus_image_2_url IS NOT NULL
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to admins
GRANT EXECUTE ON FUNCTION cleanup_orphaned_frq_images() TO authenticated;
