ALTER TABLE webinar_registrations
ADD COLUMN IF NOT EXISTS session_date text NOT NULL DEFAULT '2026-05-01';
