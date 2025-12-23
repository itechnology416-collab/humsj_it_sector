-- Add face_data column to profiles table for facial recognition
ALTER TABLE profiles 
ADD COLUMN face_data TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN profiles.face_data IS 'Encrypted face template data for facial recognition authentication';

-- Create index for faster face data queries (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_profiles_face_data ON profiles(face_data) WHERE face_data IS NOT NULL;