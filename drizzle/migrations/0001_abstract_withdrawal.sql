ALTER TYPE public.abstract_status ADD VALUE IF NOT EXISTS 'withdrawn';

CREATE OR REPLACE FUNCTION public.withdraw_abstract(_abstract_id uuid, _restore boolean DEFAULT false)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cur text;
BEGIN
  SELECT status::text INTO cur FROM public.abstracts
   WHERE id = _abstract_id AND submitted_by = auth.uid();
  IF cur IS NULL THEN RAISE EXCEPTION 'Abstract not found'; END IF;
  IF NOT private.submission_window_is_open() THEN
    RAISE EXCEPTION 'The submission period is closed';
  END IF;
  IF _restore THEN
    IF cur <> 'withdrawn' THEN RAISE EXCEPTION 'Abstract is not withdrawn'; END IF;
    UPDATE public.abstracts SET status = 'submitted'::abstract_status WHERE id = _abstract_id;
    RETURN 'submitted';
  ELSE
    IF cur <> 'submitted' THEN RAISE EXCEPTION 'Only submitted abstracts can be withdrawn'; END IF;
    UPDATE public.abstracts SET status = 'withdrawn'::text::abstract_status WHERE id = _abstract_id;
    RETURN 'withdrawn';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.withdraw_abstract(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.withdraw_abstract(uuid, boolean) TO authenticated;

DROP POLICY IF EXISTS "Reviewers read confirmed assigned abstracts" ON public.abstracts;
CREATE POLICY "Reviewers read confirmed assigned abstracts" ON public.abstracts
FOR SELECT TO authenticated
USING (
  reviewers_confirmed_at IS NOT NULL
  AND status::text <> 'withdrawn'
  AND EXISTS (SELECT 1 FROM public.review_assignments ra
              WHERE ra.abstract_id = abstracts.id AND ra.reviewer_id = auth.uid())
);