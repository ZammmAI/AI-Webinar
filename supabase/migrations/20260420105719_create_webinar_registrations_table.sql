/*
  # Create webinar registrations table

  1. New Tables
    - `webinar_registrations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `age` (text, required)
      - `phone` (text, required)
      - `role` (text, required)
      - `created_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `webinar_registrations` table
    - Add policy for anyone to insert registrations (public signups)
    - Add policy for service role to read all registrations (admin access)
*/

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  age text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for webinar"
  ON webinar_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
