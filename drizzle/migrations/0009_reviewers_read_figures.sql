CREATE POLICY "Reviewers read assigned abstract figures" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'abstracts' AND EXISTS (
  SELECT 1 FROM public.abstracts a JOIN public.review_assignments ra ON ra.abstract_id = a.id
  WHERE ra.reviewer_id = auth.uid() AND objects.name = ANY (a.figure_paths)
    AND a.status <> 'withdrawn'::abstract_status AND a.reviewers_confirmed_at IS NOT NULL));