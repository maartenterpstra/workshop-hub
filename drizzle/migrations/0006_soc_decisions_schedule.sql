CREATE TABLE public.abstract_decisions (
  abstract_id uuid PRIMARY KEY REFERENCES public.abstracts(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('oral','poster','revise','reject')),
  note text,
  decided_by uuid,
  decided_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  confirmed_by uuid,
  emailed_at timestamptz,
  revision_due_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.abstract_decisions TO authenticated;
GRANT ALL ON public.abstract_decisions TO service_role;
ALTER TABLE public.abstract_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SOC and admins manage decisions" ON public.abstract_decisions FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'))
  WITH CHECK (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "Authors read own sent decisions" ON public.abstract_decisions FOR SELECT TO authenticated
  USING (emailed_at IS NOT NULL AND EXISTS (SELECT 1 FROM public.abstracts a WHERE a.id = abstract_id AND a.submitted_by = auth.uid()));

CREATE OR REPLACE FUNCTION private.guard_decision_lock() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF; -- service role
  IF TG_OP = 'DELETE' THEN
    IF OLD.confirmed_at IS NOT NULL THEN RAISE EXCEPTION 'Decision is confirmed; an admin must unlock it first.'; END IF;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.confirmed_at IS NOT NULL THEN
    IF NEW.confirmed_at IS NULL THEN
      IF NOT private.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only admins can unlock confirmed decisions.'; END IF;
    ELSIF NEW.decision IS DISTINCT FROM OLD.decision OR NEW.note IS DISTINCT FROM OLD.note THEN
      RAISE EXCEPTION 'Decision is confirmed; an admin must unlock it first.';
    END IF;
  END IF;
  NEW.emailed_at := CASE WHEN TG_OP = 'UPDATE' THEN OLD.emailed_at ELSE NULL END;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_decision_lock BEFORE INSERT OR UPDATE OR DELETE ON public.abstract_decisions
  FOR EACH ROW EXECUTE FUNCTION private.guard_decision_lock();

CREATE TABLE public.schedule_slots (
  abstract_id uuid PRIMARY KEY REFERENCES public.abstracts(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('oral','poster')),
  position integer NOT NULL DEFAULT 0,
  start_time text,
  end_time text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule_slots TO authenticated;
GRANT ALL ON public.schedule_slots TO service_role;
ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SOC and admins manage schedule" ON public.schedule_slots FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'))
  WITH CHECK (private.has_role(auth.uid(),'soc') OR private.has_role(auth.uid(),'admin'));

ALTER TABLE public.app_config ADD COLUMN schedule_published_at timestamptz;

CREATE OR REPLACE FUNCTION public.get_public_schedule()
RETURNS TABLE(session_id text, kind text, slot_position integer, start_time text, end_time text, title text, presenter text, authors text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.session_id, s.kind, s.position, s.start_time, s.end_time, a.title,
    (SELECT au.name FROM public.abstract_authors au WHERE au.abstract_id = a.id ORDER BY au.is_presenting DESC, au.author_order LIMIT 1),
    (SELECT string_agg(au.name, ', ' ORDER BY au.author_order) FROM public.abstract_authors au WHERE au.abstract_id = a.id)
  FROM public.schedule_slots s JOIN public.abstracts a ON a.id = s.abstract_id
  WHERE EXISTS (SELECT 1 FROM public.app_config c WHERE c.id = true AND c.schedule_published_at IS NOT NULL)
    AND a.status::text <> 'withdrawn'
  ORDER BY s.session_id, s.kind, s.position;
$$;
REVOKE ALL ON FUNCTION public.get_public_schedule() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_schedule() TO anon, authenticated;

CREATE OR REPLACE FUNCTION private.revision_open(_abstract_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.abstract_decisions d JOIN public.abstracts a ON a.id = d.abstract_id
    WHERE d.abstract_id = _abstract_id AND a.submitted_by = auth.uid() AND d.decision = 'revise'
      AND d.confirmed_at IS NOT NULL AND d.emailed_at IS NOT NULL AND d.revision_due_at > now());
$$;
CREATE OR REPLACE FUNCTION private.user_has_open_revision() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.abstract_decisions d JOIN public.abstracts a ON a.id = d.abstract_id
    WHERE a.submitted_by = auth.uid() AND d.decision = 'revise'
      AND d.confirmed_at IS NOT NULL AND d.emailed_at IS NOT NULL AND d.revision_due_at > now());
$$;
GRANT EXECUTE ON FUNCTION private.revision_open(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.user_has_open_revision() TO authenticated;

CREATE POLICY "Authors revise own abstracts" ON public.abstracts FOR UPDATE TO authenticated
  USING (submitted_by = auth.uid() AND status = 'submitted' AND private.revision_open(id))
  WITH CHECK (submitted_by = auth.uid() AND status = 'submitted' AND private.revision_open(id));
CREATE POLICY "Authors insert authors during revision" ON public.abstract_authors FOR INSERT TO authenticated
  WITH CHECK (private.revision_open(abstract_id));
CREATE POLICY "Authors update authors during revision" ON public.abstract_authors FOR UPDATE TO authenticated
  USING (private.revision_open(abstract_id)) WITH CHECK (private.revision_open(abstract_id));
CREATE POLICY "Authors delete authors during revision" ON public.abstract_authors FOR DELETE TO authenticated
  USING (private.revision_open(abstract_id));
CREATE POLICY "Authors upload files during revision" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'abstracts' AND (storage.foldername(name))[1] = auth.uid()::text AND private.user_has_open_revision());
CREATE POLICY "Authors update files during revision" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'abstracts' AND (storage.foldername(name))[1] = auth.uid()::text AND private.user_has_open_revision())
  WITH CHECK (bucket_id = 'abstracts' AND (storage.foldername(name))[1] = auth.uid()::text AND private.user_has_open_revision());