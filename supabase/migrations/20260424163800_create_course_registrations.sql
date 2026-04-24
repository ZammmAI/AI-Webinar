/*
  # Create course registrations system

  1. New Tables
    - `course_registrations`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `age` (text, required)
      - `phone` (text, required)
      - `nic` (text, required)
      - `gender` (text, required)
      - `course_id` (text, required)
      - `receipt_url` (text, required)
      - `created_at` (timestamptz, auto-generated)

  2. Storage
    - Create `receipts` bucket for payment slip uploads

  3. Security
    - Enable RLS on `course_registrations` table
    - Add policy for anyone to insert (public registration)
    - Storage policies for file uploads
*/

-- Create table
CREATE TABLE IF NOT EXISTS course_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  age text NOT NULL,
  phone text NOT NULL,
  nic text NOT NULL,
  gender text NOT NULL,
  course_id text NOT NULL,
  receipt_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- Insert Policy
CREATE POLICY "Anyone can register for a course"
  ON course_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Storage Setup
-- Note: Storage buckets and policies are typically handled via the dashboard or specific storage SQL
-- But we can include the bucket creation here if the environment supports it

INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'receipts' );

CREATE POLICY "Anyone can upload a receipt"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'receipts' );
