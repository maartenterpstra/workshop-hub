CREATE TABLE public.abstract_disclosures (
  abstract_id uuid PRIMARY KEY REFERENCES public.abstracts(id) ON DELETE CASCADE,
  prior_submission boolean NOT NULL DEFAULT false,
  prior_venue text,
  prior_status text,
  funding_coi text,
  ai_use text NOT NULL DEFAULT 'None',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.abstract_disclosures TO authenticated;
GRANT ALL ON public.abstract_disclosures TO service_role;
ALTER TABLE public.abstract_disclosures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors read own disclosures" ON public.abstract_disclosures FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.abstracts a WHERE a.id = abstract_id AND a.submitted_by = auth.uid()));
CREATE POLICY "Authors insert own disclosures" ON public.abstract_disclosures FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.abstracts a WHERE a.id = abstract_id AND a.submitted_by = auth.uid()) AND private.submission_window_is_open());
CREATE POLICY "Authors update own disclosures" ON public.abstract_disclosures FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.abstracts a WHERE a.id = abstract_id AND a.submitted_by = auth.uid()) AND private.submission_window_is_open())
  WITH CHECK (EXISTS (SELECT 1 FROM public.abstracts a WHERE a.id = abstract_id AND a.submitted_by = auth.uid()));
CREATE POLICY "SOC and admins read disclosures" ON public.abstract_disclosures FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'soc'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.reviewer_notes (
  assignment_id uuid PRIMARY KEY REFERENCES public.review_assignments(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.reviewer_notes TO authenticated;
GRANT ALL ON public.reviewer_notes TO service_role;
ALTER TABLE public.reviewer_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviewers read own notes" ON public.reviewer_notes FOR SELECT TO authenticated USING (reviewer_id = auth.uid());
CREATE POLICY "Reviewers insert own notes" ON public.reviewer_notes FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid() AND EXISTS (SELECT 1 FROM public.review_assignments ra WHERE ra.id = assignment_id AND ra.reviewer_id = auth.uid()));
CREATE POLICY "Reviewers update own notes" ON public.reviewer_notes FOR UPDATE TO authenticated
  USING (reviewer_id = auth.uid()) WITH CHECK (reviewer_id = auth.uid());