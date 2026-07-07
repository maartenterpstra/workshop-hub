
DROP FUNCTION IF EXISTS public.assign_reviewers_for_abstract(UUID);

CREATE OR REPLACE FUNCTION private.assign_reviewers_for_abstract()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
DECLARE
  _rec RECORD;
BEGIN
  IF NEW.topic_id IS NULL THEN RETURN NEW; END IF;

  FOR _rec IN
    SELECT re.reviewer_id
    FROM public.reviewer_expertise re
    LEFT JOIN public.review_assignments ra ON ra.reviewer_id = re.reviewer_id
    WHERE re.topic_id = NEW.topic_id
      AND re.reviewer_id <> NEW.submitted_by
    GROUP BY re.reviewer_id
    ORDER BY COUNT(ra.id) ASC, random()
    LIMIT 5
  LOOP
    INSERT INTO public.review_assignments (abstract_id, reviewer_id, status)
    VALUES (NEW.id, _rec.reviewer_id, 'pending')
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_reviewers ON public.abstracts;
CREATE TRIGGER trg_assign_reviewers
  AFTER INSERT ON public.abstracts
  FOR EACH ROW EXECUTE FUNCTION private.assign_reviewers_for_abstract();
