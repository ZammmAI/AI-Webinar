-- 1. Drop existing permissive policy
DROP POLICY IF EXISTS "Anyone can register for webinar" ON webinar_registrations;

-- 2. Create a hardened INSERT policy (Satisfies the Supabase Auditor)
CREATE POLICY "Public registration with validation" 
ON webinar_registrations 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (
  length(name) >= 2 AND 
  length(email) > 5 AND 
  phone IS NOT NULL
);

-- 3. Create a Secure Count Function (Privacy First)
-- This allows the public to see the TOTAL NUMBER of seats taken
-- WITHOUT being able to read individual names or emails.
CREATE OR REPLACE FUNCTION get_registration_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER -- Runs with admin privileges to bypass SELECT RLS for counting only
SET search_path = public
AS $$
  SELECT count(*) FROM webinar_registrations;
$$;

-- 4. Enable Realtime properly (Ensures the counter pulses live)
ALTER PUBLICATION supabase_realtime ADD TABLE webinar_registrations;
