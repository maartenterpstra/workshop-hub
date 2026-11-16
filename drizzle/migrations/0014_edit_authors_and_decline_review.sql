ALTER TABLE public.review_assignments ADD COLUMN IF NOT EXISTS decline_reason text;

CREATE OR REPLACE FUNCTION public.replace_abstract_authors(_abstract_id uuid, _authors jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE st text; n int;
BEGIN
  SELECT status::text INTO st FROM public.abstracts WHERE id = _abstract_id AND submitted_by = auth.uid();
  IF st IS NULL THEN RAISE EXCEPTION 'Abstract not found'; END IF;
  IF st = 'withdrawn' THEN RAISE EXCEPTION 'Withdrawn abstracts cannot be edited'; END IF;
  IF EXISTS (SELECT 1 FROM public.app_config WHERE id = true AND schedule_published_at IS NOT NULL) THEN
    RAISE EXCEPTION 'The programme has been published; contact the organisers to change authors';
  END IF;
  n := jsonb_array_length(_authors);
  IF n < 1 OR n > 30 THEN RAISE EXCEPTION 'Provide between 1 and 30 authors'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(_authors) e WHERE length(trim(coalesce(e->>'name',''))) = 0 OR length(e->>'name') > 200) THEN
    RAISE EXCEPTION 'Each author needs a name (max 200 characters)';
  END IF;
  IF (SELECT count(*) FROM jsonb_array_elements(_authors) e WHERE coalesce((e->>'is_presenting')::boolean,false)) <> 1 THEN
    RAISE EXCEPTION 'Choose exactly one presenting author';
  END IF;
  DELETE FROM public.abstract_authors WHERE abstract_id = _abstract_id;
  INSERT INTO public.abstract_authors (abstract_id, name, affiliation, email, is_presenting, author_order)
  SELECT _abstract_id, trim(e->>'name'), nullif(left(trim(coalesce(e->>'affiliation','')),300),''),
         nullif(left(trim(coalesce(e->>'email','')),254),''), coalesce((e->>'is_presenting')::boolean,false), o::int
  FROM jsonb_array_elements(_authors) WITH ORDINALITY AS t(e, o);
END $$;
REVOKE ALL ON FUNCTION public.replace_abstract_authors(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.replace_abstract_authors(uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.decline_review(_assignment_id uuid, _reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.review_assignments WHERE id = _assignment_id AND reviewer_id = auth.uid()) THEN
    RAISE EXCEPTION 'Assignment not found';
  END IF;
  IF EXISTS (SELECT 1 FROM public.reviews WHERE assignment_id = _assignment_id) THEN
    RAISE EXCEPTION 'You already submitted a review for this abstract; contact the organisers';
  END IF;
  UPDATE public.review_assignments SET status = 'declined_coi', decline_reason = nullif(left(trim(coalesce(_reason,'')),500),'')
  WHERE id = _assignment_id;
END $$;
REVOKE ALL ON FUNCTION public.decline_review(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.decline_review(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.reassign_review(_assignment_id uuid, _reviewer_id uuid DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE abs_id uuid; topic uuid; pick uuid; confirmed boolean;
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT ra.abstract_id, a.topic_id, a.reviewers_confirmed_at IS NOT NULL INTO abs_id, topic, confirmed
  FROM public.review_assignments ra JOIN public.abstracts a ON a.id = ra.abstract_id
  WHERE ra.id = _assignment_id AND ra.status = 'declined_coi';
  IF abs_id IS NULL THEN RAISE EXCEPTION 'Declined assignment not found'; END IF;
  IF _reviewer_id IS NOT NULL THEN
    pick := _reviewer_id;
    IF NOT private.has_role(pick, 'reviewer') THEN RAISE EXCEPTION 'Not a reviewer'; END IF;
  ELSE
    SELECT ur.user_id INTO pick FROM public.user_roles ur
    WHERE ur.role = 'reviewer'
      AND ur.user_id NOT IN (SELECT reviewer_id FROM public.review_assignments WHERE abstract_id = abs_id)
      AND ur.user_id <> (SELECT submitted_by FROM public.abstracts WHERE id = abs_id)
    ORDER BY (EXISTS (SELECT 1 FROM public.reviewer_expertise re WHERE re.reviewer_id = ur.user_id AND re.topic_id = topic)) DESC,
             (SELECT count(*) FROM public.review_assignments x WHERE x.reviewer_id = ur.user_id AND x.status <> 'declined_coi'),
             random()
    LIMIT 1;
  END IF;
  IF pick IS NULL THEN RAISE EXCEPTION 'No available reviewer'; END IF;
  IF EXISTS (SELECT 1 FROM public.review_assignments WHERE abstract_id = abs_id AND reviewer_id = pick) THEN
    RAISE EXCEPTION 'Reviewer is already assigned to this abstract';
  END IF;
  INSERT INTO public.review_assignments (abstract_id, reviewer_id) VALUES (abs_id, pick);
  RETURN pick;
END $$;
REVOKE ALL ON FUNCTION public.reassign_review(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reassign_review(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_declined_reviews()
RETURNS TABLE(assignment_id uuid, abstract_id uuid, abstract_number integer, title text, reviewer_email text, reviewer_name text, decline_reason text, active_reviewers integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN QUERY
  SELECT ra.id, a.id, a.abstract_number, a.title, u.email::text, p.full_name, ra.decline_reason,
    (SELECT count(*)::int FROM public.review_assignments x WHERE x.abstract_id = a.id AND x.status <> 'declined_coi')
  FROM public.review_assignments ra JOIN public.abstracts a ON a.id = ra.abstract_id
  JOIN auth.users u ON u.id = ra.reviewer_id LEFT JOIN public.profiles p ON p.id = ra.reviewer_id
  WHERE ra.status = 'declined_coi' ORDER BY a.abstract_number;
END $$;
REVOKE ALL ON FUNCTION public.admin_declined_reviews() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_declined_reviews() TO authenticated;