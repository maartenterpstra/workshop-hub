-- Reviewers who declined an assignment (declined_coi) lose all access to that abstract.
DROP POLICY IF EXISTS "Reviewers read confirmed assigned abstracts" ON public.abstracts;
CREATE POLICY "Reviewers read confirmed assigned abstracts" ON public.abstracts
  FOR SELECT TO authenticated
  USING (reviewers_confirmed_at IS NOT NULL AND status::text <> 'withdrawn'
    AND EXISTS (SELECT 1 FROM public.review_assignments ra
      WHERE ra.abstract_id = abstracts.id AND ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi'));

DROP POLICY IF EXISTS "Reviewers read assigned abstract files" ON storage.objects;
CREATE POLICY "Reviewers read assigned abstract files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'abstracts' AND EXISTS (SELECT 1 FROM public.abstracts a
    JOIN public.review_assignments ra ON ra.abstract_id = a.id
    WHERE ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi' AND a.file_path = objects.name
      AND a.status <> 'withdrawn' AND a.reviewers_confirmed_at IS NOT NULL));

DROP POLICY IF EXISTS "Reviewers read assigned abstract figures" ON storage.objects;
CREATE POLICY "Reviewers read assigned abstract figures" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'abstracts' AND EXISTS (SELECT 1 FROM public.abstracts a
    JOIN public.review_assignments ra ON ra.abstract_id = a.id
    WHERE ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi' AND objects.name = ANY (a.figure_paths)
      AND a.status <> 'withdrawn' AND a.reviewers_confirmed_at IS NOT NULL));

-- A declined assignment cannot be flipped back by the reviewer, and its status cannot be set to declined except via decline_review().
DROP POLICY IF EXISTS "Reviewers update own assignment status during review window" ON public.review_assignments;
CREATE POLICY "Reviewers update own assignment status during review window" ON public.review_assignments
  FOR UPDATE TO authenticated
  USING (reviewer_id = auth.uid() AND status <> 'declined_coi' AND private.review_window_is_open() AND private.is_reviewers_confirmed(abstract_id))
  WITH CHECK (reviewer_id = auth.uid() AND status <> 'declined_coi' AND private.review_window_is_open() AND private.is_reviewers_confirmed(abstract_id));

DROP POLICY IF EXISTS "Reviewers insert own reviews during review window" ON public.reviews;
CREATE POLICY "Reviewers insert own reviews during review window" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (private.review_window_is_open() AND EXISTS (SELECT 1 FROM public.review_assignments ra
    JOIN public.abstracts a ON a.id = ra.abstract_id
    WHERE ra.id = reviews.assignment_id AND ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi' AND a.reviewers_confirmed_at IS NOT NULL));

DROP POLICY IF EXISTS "Reviewers update own reviews during review window" ON public.reviews;
CREATE POLICY "Reviewers update own reviews during review window" ON public.reviews
  FOR UPDATE TO authenticated
  USING (private.review_window_is_open() AND EXISTS (SELECT 1 FROM public.review_assignments ra
    JOIN public.abstracts a ON a.id = ra.abstract_id
    WHERE ra.id = reviews.assignment_id AND ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi' AND a.reviewers_confirmed_at IS NOT NULL))
  WITH CHECK (private.review_window_is_open() AND EXISTS (SELECT 1 FROM public.review_assignments ra
    JOIN public.abstracts a ON a.id = ra.abstract_id
    WHERE ra.id = reviews.assignment_id AND ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi' AND a.reviewers_confirmed_at IS NOT NULL));

DROP POLICY IF EXISTS "Reviewers insert own notes" ON public.reviewer_notes;
CREATE POLICY "Reviewers insert own notes" ON public.reviewer_notes
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = auth.uid() AND EXISTS (SELECT 1 FROM public.review_assignments ra
    WHERE ra.id = reviewer_notes.assignment_id AND ra.reviewer_id = auth.uid() AND ra.status <> 'declined_coi'));