ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS feedback_value text,
  ADD COLUMN IF NOT EXISTS feedback_improve text,
  ADD COLUMN IF NOT EXISTS feedback_tips text;

CREATE OR REPLACE FUNCTION private.validate_review_feedback()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF coalesce(btrim(NEW.feedback_value),'') = '' OR coalesce(btrim(NEW.feedback_improve),'') = '' OR coalesce(btrim(NEW.feedback_tips),'') = '' THEN
    RAISE EXCEPTION 'Please answer all three feedback questions.';
  END IF;
  IF length(NEW.feedback_value) > 2000 OR length(NEW.feedback_improve) > 2000 OR length(NEW.feedback_tips) > 2000 THEN
    RAISE EXCEPTION 'Feedback answers are limited to 2000 characters each.';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_review_feedback ON public.reviews;
CREATE TRIGGER validate_review_feedback BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION private.validate_review_feedback();

CREATE OR REPLACE FUNCTION public.get_my_review_feedback(_abstract_id uuid)
RETURNS TABLE(feedback_value text, feedback_improve text, feedback_tips text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.feedback_value, r.feedback_improve, r.feedback_tips
  FROM public.reviews r
  JOIN public.review_assignments ra ON ra.id = r.assignment_id
  JOIN public.abstracts a ON a.id = ra.abstract_id
  JOIN public.abstract_decisions d ON d.abstract_id = a.id
  WHERE a.id = _abstract_id AND a.submitted_by = auth.uid()
    AND d.emailed_at IS NOT NULL AND r.feedback_value IS NOT NULL
  ORDER BY r.submitted_at;
$$;
REVOKE ALL ON FUNCTION public.get_my_review_feedback(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_my_review_feedback(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_reviewer_status()
RETURNS TABLE(reviewer_id uuid, email text, full_name text, last_sign_in_at timestamptz, must_change_password boolean, assigned integer, reviewed integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
  SELECT ur.user_id, u.email::text, p.full_name, u.last_sign_in_at, coalesce(p.must_change_password, true),
    (SELECT count(*)::int FROM public.review_assignments ra WHERE ra.reviewer_id = ur.user_id),
    (SELECT count(*)::int FROM public.review_assignments ra JOIN public.reviews r ON r.assignment_id = ra.id WHERE ra.reviewer_id = ur.user_id)
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  LEFT JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.role = 'reviewer'
  ORDER BY p.full_name;
END $$;
REVOKE ALL ON FUNCTION public.admin_reviewer_status() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_reviewer_status() TO authenticated;