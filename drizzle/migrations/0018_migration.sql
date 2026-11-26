CREATE TABLE public.submission_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  step text NOT NULL,
  message text,
  file_size bigint,
  file_type text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.submission_errors TO authenticated;
GRANT ALL ON public.submission_errors TO service_role;
ALTER TABLE public.submission_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users log own submission errors" ON public.submission_errors FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND length(step) <= 100 AND (message IS NULL OR length(message) <= 1000) AND (user_agent IS NULL OR length(user_agent) <= 500));
CREATE POLICY "Admins read submission errors" ON public.submission_errors FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));