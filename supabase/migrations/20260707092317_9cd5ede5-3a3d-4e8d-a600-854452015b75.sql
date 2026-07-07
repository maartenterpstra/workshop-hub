
-- 1. Seed topics
INSERT INTO public.topics (name, display_order) VALUES
  ('Segmentation & Registration', 1),
  ('Reconstruction & Synthesis', 2),
  ('Foundation Models & Text', 3),
  ('Dose & Adaptive Workflows', 4),
  ('Clinical Predictions & Outcomes', 5),
  ('Implementation, QA & Ethics', 6)
ON CONFLICT DO NOTHING;

-- 2. Reviewer expertise
CREATE TABLE IF NOT EXISTS public.reviewer_expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reviewer_id, topic_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviewer_expertise TO authenticated;
GRANT ALL ON public.reviewer_expertise TO service_role;
ALTER TABLE public.reviewer_expertise ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviewers read own expertise" ON public.reviewer_expertise
  FOR SELECT USING (reviewer_id = auth.uid());
CREATE POLICY "SOC and admins read all expertise" ON public.reviewer_expertise
  FOR SELECT USING (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "SOC and admins manage expertise" ON public.reviewer_expertise
  FOR ALL USING (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'))
  WITH CHECK (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'));

-- 3. App config
CREATE TABLE IF NOT EXISTS public.app_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id = TRUE),
  submission_opens_at TIMESTAMPTZ,
  submission_closes_at TIMESTAMPTZ,
  debug_mode BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_config TO anon, authenticated;
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads app config" ON public.app_config FOR SELECT USING (TRUE);
CREATE POLICY "Admins update app config" ON public.app_config
  FOR UPDATE USING (private.has_role(auth.uid(),'admin'))
  WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert app config" ON public.app_config
  FOR INSERT WITH CHECK (private.has_role(auth.uid(),'admin'));

INSERT INTO public.app_config (id, submission_opens_at, submission_closes_at, debug_mode)
VALUES (TRUE, NULL, NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Extend reviews with new score fields
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS score_technical INTEGER CHECK (score_technical BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS score_reproducibility INTEGER CHECK (score_reproducibility BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS score_fit_session INTEGER CHECK (score_fit_session BETWEEN 1 AND 5);

-- Ensure existing score cols have 1..5 constraint too (safe if already present)
DO $$ BEGIN
  ALTER TABLE public.reviews ADD CONSTRAINT reviews_score_novelty_range CHECK (score_novelty IS NULL OR score_novelty BETWEEN 1 AND 5);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.reviews ADD CONSTRAINT reviews_score_relevance_range CHECK (score_relevance IS NULL OR score_relevance BETWEEN 1 AND 5);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Round-robin reviewer assignment RPC
CREATE OR REPLACE FUNCTION public.assign_reviewers_for_abstract(_abstract_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
DECLARE
  _topic_id UUID;
  _submitter UUID;
  _inserted INTEGER := 0;
  _rec RECORD;
BEGIN
  SELECT topic_id, submitted_by INTO _topic_id, _submitter FROM public.abstracts WHERE id = _abstract_id;
  IF _topic_id IS NULL THEN RETURN 0; END IF;

  -- Only the submitter (or SOC/admin) may trigger assignment for this abstract
  IF auth.uid() IS DISTINCT FROM _submitter
     AND NOT (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  FOR _rec IN
    SELECT re.reviewer_id, COUNT(ra.id) AS load
    FROM public.reviewer_expertise re
    LEFT JOIN public.review_assignments ra ON ra.reviewer_id = re.reviewer_id
    WHERE re.topic_id = _topic_id
      AND re.reviewer_id <> _submitter
      AND NOT EXISTS (
        SELECT 1 FROM public.review_assignments x
        WHERE x.abstract_id = _abstract_id AND x.reviewer_id = re.reviewer_id
      )
    GROUP BY re.reviewer_id
    ORDER BY load ASC, random()
    LIMIT 5
  LOOP
    INSERT INTO public.review_assignments (abstract_id, reviewer_id, status)
    VALUES (_abstract_id, _rec.reviewer_id, 'pending')
    ON CONFLICT DO NOTHING;
    _inserted := _inserted + 1;
  END LOOP;

  RETURN _inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_reviewers_for_abstract(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_reviewers_for_abstract(UUID) TO authenticated;

-- 6. Storage policies for the private 'abstracts' bucket
--    Path convention: <user_id>/<abstract_id>.pdf

-- Authors upload only into their own folder
CREATE POLICY "Authors upload own abstract files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'abstracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authors read own abstract files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'abstracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authors update own abstract files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'abstracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authors delete own abstract files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'abstracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Reviewers read files for abstracts assigned to them
CREATE POLICY "Reviewers read assigned abstract files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'abstracts'
    AND EXISTS (
      SELECT 1 FROM public.abstracts a
      JOIN public.review_assignments ra ON ra.abstract_id = a.id
      WHERE ra.reviewer_id = auth.uid()
        AND a.file_path = storage.objects.name
    )
  );

-- SOC and admins read all abstract files
CREATE POLICY "SOC and admins read all abstract files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'abstracts'
    AND (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'))
  );
