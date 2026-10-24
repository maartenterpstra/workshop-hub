DROP POLICY IF EXISTS "Reviewers read assigned abstract files" ON storage.objects;
CREATE POLICY "Reviewers read assigned abstract files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'abstracts' AND EXISTS (
  SELECT 1 FROM public.abstracts a JOIN public.review_assignments ra ON ra.abstract_id = a.id
  WHERE ra.reviewer_id = auth.uid() AND a.file_path = objects.name
    AND a.status <> 'withdrawn'::public.abstract_status AND a.reviewers_confirmed_at IS NOT NULL));