CREATE TABLE public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_at timestamptz NOT NULL DEFAULT now(),
  sent_by uuid,
  abstract_id uuid REFERENCES public.abstracts(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  kind text NOT NULL DEFAULT 'manual',
  status text NOT NULL,
  error text
);
GRANT SELECT ON public.email_log TO authenticated;
GRANT ALL ON public.email_log TO service_role;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read email log" ON public.email_log FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(),'admin'));
CREATE INDEX email_log_sent_at_idx ON public.email_log (sent_at DESC);