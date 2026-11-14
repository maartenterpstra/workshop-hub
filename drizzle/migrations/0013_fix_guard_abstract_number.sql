CREATE OR REPLACE FUNCTION private.guard_abstract_number() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.abstract_number := nextval('public.abstract_number_seq');
    NEW.pdf_anon_checked_at := NULL;
  ELSE
    NEW.abstract_number := OLD.abstract_number;
    IF NEW.pdf_anon_checked_at IS DISTINCT FROM OLD.pdf_anon_checked_at
       AND auth.uid() IS NOT NULL
       AND NOT (private.has_role(auth.uid(),'soc'::app_role) OR private.has_role(auth.uid(),'admin'::app_role)) THEN
      NEW.pdf_anon_checked_at := OLD.pdf_anon_checked_at;
    END IF;
    IF NEW.file_path IS DISTINCT FROM OLD.file_path THEN NEW.pdf_anon_checked_at := NULL; END IF;
  END IF;
  RETURN NEW;
END $$;