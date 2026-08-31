-- 1. Forced password change flag
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;

-- 2. Reviewer panel confirmation on abstracts
ALTER TABLE public.abstracts
  ADD COLUMN IF NOT EXISTS reviewers_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewers_confirmed_by uuid;

-- 3. Balanced tentative assignment
CREATE OR REPLACE FUNCTION private.assign_reviewers_for_abstract()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
DECLARE
  _rec RECORD;
  _needed int := 5;
BEGIN
  -- topic-matched reviewers first, least loaded first
  FOR _rec IN
    SELECT r.user_id AS reviewer_id
    FROM public.user_roles r
    JOIN public.reviewer_expertise re
      ON re.reviewer_id = r.user_id AND re.topic_id = NEW.topic_id
    LEFT JOIN public.review_assignments ra ON ra.reviewer_id = r.user_id
    WHERE r.role = 'reviewer'::app_role
      AND r.user_id <> NEW.submitted_by
      AND NEW.topic_id IS NOT NULL
    GROUP BY r.user_id
    ORDER BY COUNT(ra.id) ASC, random()
    LIMIT _needed
  LOOP
    INSERT INTO public.review_assignments (abstract_id, reviewer_id, status)
    VALUES (NEW.id, _rec.reviewer_id, 'pending')
    ON CONFLICT DO NOTHING;
  END LOOP;

  SELECT 5 - COUNT(*) INTO _needed
  FROM public.review_assignments WHERE abstract_id = NEW.id;

  -- fill up with least-loaded remaining reviewers when too few match the topic
  IF _needed > 0 THEN
    FOR _rec IN
      SELECT r.user_id AS reviewer_id
      FROM public.user_roles r
      LEFT JOIN public.review_assignments ra ON ra.reviewer_id = r.user_id
      WHERE r.role = 'reviewer'::app_role
        AND r.user_id <> NEW.submitted_by
        AND NOT EXISTS (
          SELECT 1 FROM public.review_assignments x
          WHERE x.abstract_id = NEW.id AND x.reviewer_id = r.user_id
        )
      GROUP BY r.user_id
      ORDER BY COUNT(ra.id) ASC, random()
      LIMIT _needed
    LOOP
      INSERT INTO public.review_assignments (abstract_id, reviewer_id, status)
      VALUES (NEW.id, _rec.reviewer_id, 'pending')
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$function$;

-- 4. Reviewers only see confirmed panels
DROP POLICY IF EXISTS "Reviewers read assigned abstracts" ON public.abstracts;
CREATE POLICY "Reviewers read confirmed assigned abstracts"
ON public.abstracts FOR SELECT TO authenticated
USING (
  reviewers_confirmed_at IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.review_assignments ra
    WHERE ra.abstract_id = abstracts.id AND ra.reviewer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Reviewers read own assignments" ON public.review_assignments;
CREATE POLICY "Reviewers read own confirmed assignments"
ON public.review_assignments FOR SELECT TO authenticated
USING (
  reviewer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE a.id = review_assignments.abstract_id AND a.reviewers_confirmed_at IS NOT NULL
  )
);

DROP POLICY IF EXISTS "Reviewers update own assignment status" ON public.review_assignments;
CREATE POLICY "Reviewers update own confirmed assignment status"
ON public.review_assignments FOR UPDATE TO authenticated
USING (
  reviewer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE a.id = review_assignments.abstract_id AND a.reviewers_confirmed_at IS NOT NULL
  )
)
WITH CHECK (reviewer_id = auth.uid());

-- 5. Only admins may create / move / delete assignments
DROP POLICY IF EXISTS "SOC and admins insert assignments" ON public.review_assignments;
DROP POLICY IF EXISTS "SOC and admins update assignments" ON public.review_assignments;
DROP POLICY IF EXISTS "SOC and admins delete assignments" ON public.review_assignments;

CREATE POLICY "Admins insert assignments"
ON public.review_assignments FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update assignments"
ON public.review_assignments FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete assignments"
ON public.review_assignments FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));

-- 6. Admins can read reviewer profiles for the assignment editor
DROP POLICY IF EXISTS "Admins read reviewer expertise" ON public.reviewer_expertise;
CREATE POLICY "Admins read reviewer expertise"
ON public.reviewer_expertise FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));