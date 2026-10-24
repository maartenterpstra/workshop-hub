CREATE OR REPLACE FUNCTION private.guard_decision_lock() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN COALESCE(NEW, OLD); END IF; -- service role
  IF TG_OP = 'DELETE' THEN
    IF OLD.confirmed_at IS NOT NULL THEN RAISE EXCEPTION 'Decision is confirmed; an admin must unlock it first.'; END IF;
    RETURN OLD;
  END IF;
  IF TG_OP = 'INSERT' THEN NEW.emailed_at := NULL; RETURN NEW; END IF;
  IF OLD.confirmed_at IS NOT NULL THEN
    IF NEW.confirmed_at IS NULL THEN
      IF NOT private.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Only admins can unlock confirmed decisions.'; END IF;
      -- unlocking starts a new decision round: a fresh email will be needed
      NEW.emailed_at := NULL;
      RETURN NEW;
    ELSIF NEW.decision IS DISTINCT FROM OLD.decision OR NEW.note IS DISTINCT FROM OLD.note THEN
      RAISE EXCEPTION 'Decision is confirmed; an admin must unlock it first.';
    END IF;
  END IF;
  NEW.emailed_at := OLD.emailed_at;
  RETURN NEW;
END $$;