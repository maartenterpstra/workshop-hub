ALTER TABLE public.abstracts ADD COLUMN abstract_number integer UNIQUE;
ALTER TABLE public.abstracts ADD COLUMN pdf_anon_checked_at timestamptz;
CREATE SEQUENCE public.abstract_number_seq;
GRANT USAGE ON SEQUENCE public.abstract_number_seq TO authenticated, service_role;
WITH n AS (SELECT id, row_number() OVER (ORDER BY submitted_at, id) rn FROM public.abstracts WHERE id <> '00000000-0000-4000-a000-000000000001')
UPDATE public.abstracts a SET abstract_number = n.rn FROM n WHERE a.id = n.id;
SELECT setval('public.abstract_number_seq', COALESCE((SELECT max(abstract_number) FROM public.abstracts), 0) + 1, false);
CREATE OR REPLACE FUNCTION private.guard_abstract_number() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.abstract_number := nextval('public.abstract_number_seq');
    NEW.pdf_anon_checked_at := NULL;
  ELSE
    NEW.abstract_number := OLD.abstract_number;
    IF NEW.pdf_anon_checked_at IS DISTINCT FROM OLD.pdf_anon_checked_at
       AND NOT (public.has_role(auth.uid(),'soc') OR public.has_role(auth.uid(),'admin')) THEN
      NEW.pdf_anon_checked_at := OLD.pdf_anon_checked_at;
    END IF;
    IF NEW.file_path IS DISTINCT FROM OLD.file_path THEN NEW.pdf_anon_checked_at := NULL; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_abstract_number BEFORE INSERT OR UPDATE ON public.abstracts FOR EACH ROW EXECUTE FUNCTION private.guard_abstract_number();