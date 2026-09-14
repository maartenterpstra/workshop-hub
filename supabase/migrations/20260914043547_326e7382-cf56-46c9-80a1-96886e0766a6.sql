ALTER TABLE public.app_config
  ADD COLUMN IF NOT EXISTS review_closes_at timestamptz;

CREATE OR REPLACE FUNCTION private.submission_window_is_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT debug_mode OR (
      submission_opens_at IS NOT NULL
      AND now() >= submission_opens_at
      AND (submission_closes_at IS NULL OR now() < submission_closes_at)
    )
    FROM public.app_config
    WHERE id = true
  ), false)
$$;

CREATE OR REPLACE FUNCTION private.review_window_is_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT debug_mode OR (
      submission_closes_at IS NOT NULL
      AND now() >= submission_closes_at
      AND review_closes_at IS NOT NULL
      AND now() < review_closes_at
    )
    FROM public.app_config
    WHERE id = true
  ), false)
$$;

REVOKE ALL ON FUNCTION private.submission_window_is_open() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.review_window_is_open() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.submission_window_is_open() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.review_window_is_open() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.validate_required_abstract_figure()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.figure_paths IS NULL OR cardinality(NEW.figure_paths) < 1 THEN
    RAISE EXCEPTION 'At least one figure or table image is required.';
  END IF;
  IF cardinality(NEW.figure_paths) > 2 THEN
    RAISE EXCEPTION 'No more than two figure or table images are allowed.';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.validate_required_abstract_figure() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS validate_required_abstract_figure ON public.abstracts;
CREATE TRIGGER validate_required_abstract_figure
BEFORE INSERT OR UPDATE OF figure_paths ON public.abstracts
FOR EACH ROW EXECUTE FUNCTION private.validate_required_abstract_figure();

DROP POLICY IF EXISTS "Authors insert own abstracts" ON public.abstracts;
CREATE POLICY "Authors insert own abstracts"
ON public.abstracts FOR INSERT TO authenticated
WITH CHECK (
  submitted_by = auth.uid()
  AND status = 'submitted'::abstract_status
  AND private.submission_window_is_open()
);

DROP POLICY IF EXISTS "Authors update own abstracts while submitted" ON public.abstracts;
CREATE POLICY "Authors update own abstracts while submissions open"
ON public.abstracts FOR UPDATE TO authenticated
USING (
  submitted_by = auth.uid()
  AND status = 'submitted'::abstract_status
  AND private.submission_window_is_open()
)
WITH CHECK (
  submitted_by = auth.uid()
  AND status = 'submitted'::abstract_status
  AND private.submission_window_is_open()
);

DROP POLICY IF EXISTS "Authors insert own abstract authors" ON public.abstract_authors;
CREATE POLICY "Authors insert own abstract authors while submissions open"
ON public.abstract_authors FOR INSERT TO authenticated
WITH CHECK (
  private.submission_window_is_open()
  AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE a.id = abstract_authors.abstract_id
      AND a.submitted_by = auth.uid()
      AND a.status = 'submitted'::abstract_status
  )
);

DROP POLICY IF EXISTS "Authors update own abstract authors" ON public.abstract_authors;
CREATE POLICY "Authors update own abstract authors while submissions open"
ON public.abstract_authors FOR UPDATE TO authenticated
USING (
  private.submission_window_is_open()
  AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE a.id = abstract_authors.abstract_id
      AND a.submitted_by = auth.uid()
      AND a.status = 'submitted'::abstract_status
  )
)
WITH CHECK (
  private.submission_window_is_open()
  AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE a.id = abstract_authors.abstract_id
      AND a.submitted_by = auth.uid()
      AND a.status = 'submitted'::abstract_status
  )
);

DROP POLICY IF EXISTS "Authors delete own abstract authors" ON public.abstract_authors;
CREATE POLICY "Authors delete own abstract authors while submissions open"
ON public.abstract_authors FOR DELETE TO authenticated
USING (
  private.submission_window_is_open()
  AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE a.id = abstract_authors.abstract_id
      AND a.submitted_by = auth.uid()
      AND a.status = 'submitted'::abstract_status
  )
);

DROP POLICY IF EXISTS "Authors upload own abstract files" ON storage.objects;
CREATE POLICY "Authors upload own abstract files while submissions open"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'abstracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND private.submission_window_is_open()
);

DROP POLICY IF EXISTS "Authors update own abstract files" ON storage.objects;
CREATE POLICY "Authors update own abstract files while submissions open"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'abstracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND private.submission_window_is_open()
)
WITH CHECK (
  bucket_id = 'abstracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND private.submission_window_is_open()
);

DROP POLICY IF EXISTS "Authors delete own abstract files" ON storage.objects;
CREATE POLICY "Authors delete own abstract files while submissions open"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'abstracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND private.submission_window_is_open()
);

DROP POLICY IF EXISTS "Reviewers insert own reviews" ON public.reviews;
CREATE POLICY "Reviewers insert own reviews during review window"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (
  private.review_window_is_open()
  AND EXISTS (
    SELECT 1
    FROM public.review_assignments ra
    JOIN public.abstracts a ON a.id = ra.abstract_id
    WHERE ra.id = reviews.assignment_id
      AND ra.reviewer_id = auth.uid()
      AND a.reviewers_confirmed_at IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Reviewers update own reviews" ON public.reviews;
CREATE POLICY "Reviewers update own reviews during review window"
ON public.reviews FOR UPDATE TO authenticated
USING (
  private.review_window_is_open()
  AND EXISTS (
    SELECT 1
    FROM public.review_assignments ra
    JOIN public.abstracts a ON a.id = ra.abstract_id
    WHERE ra.id = reviews.assignment_id
      AND ra.reviewer_id = auth.uid()
      AND a.reviewers_confirmed_at IS NOT NULL
  )
)
WITH CHECK (
  private.review_window_is_open()
  AND EXISTS (
    SELECT 1
    FROM public.review_assignments ra
    JOIN public.abstracts a ON a.id = ra.abstract_id
    WHERE ra.id = reviews.assignment_id
      AND ra.reviewer_id = auth.uid()
      AND a.reviewers_confirmed_at IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Reviewers update own confirmed assignment status" ON public.review_assignments;
CREATE POLICY "Reviewers update own assignment status during review window"
ON public.review_assignments FOR UPDATE TO authenticated
USING (
  reviewer_id = auth.uid()
  AND private.review_window_is_open()
  AND private.is_reviewers_confirmed(abstract_id)
)
WITH CHECK (
  reviewer_id = auth.uid()
  AND private.review_window_is_open()
  AND private.is_reviewers_confirmed(abstract_id)
);