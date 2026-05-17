ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS submission_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS source_fingerprint TEXT;

CREATE INDEX IF NOT EXISTS leads_email_created_at_idx
  ON public.leads (email, created_at DESC);

CREATE INDEX IF NOT EXISTS leads_submission_fingerprint_created_at_idx
  ON public.leads (submission_fingerprint, created_at DESC)
  WHERE submission_fingerprint IS NOT NULL;

CREATE INDEX IF NOT EXISTS leads_source_fingerprint_created_at_idx
  ON public.leads (source_fingerprint, created_at DESC)
  WHERE source_fingerprint IS NOT NULL;
