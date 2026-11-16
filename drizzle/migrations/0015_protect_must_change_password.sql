CREATE OR REPLACE FUNCTION private.guard_must_change_password()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.must_change_password IS DISTINCT FROM OLD.must_change_password
     AND current_user NOT IN ('service_role','postgres','supabase_admin')
     AND coalesce(current_setting('app.pw_change_ok', true), '') <> 'on' THEN
    RAISE EXCEPTION 'must_change_password cannot be changed directly';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_guard_must_change_password ON public.profiles;
CREATE TRIGGER trg_guard_must_change_password BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION private.guard_must_change_password();

CREATE OR REPLACE FUNCTION public.complete_password_change()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = auth.uid() AND u.updated_at > now() - interval '10 minutes') THEN
    RAISE EXCEPTION 'Please set a new password first';
  END IF;
  PERFORM set_config('app.pw_change_ok', 'on', true);
  UPDATE public.profiles SET must_change_password = false WHERE id = auth.uid();
  PERFORM set_config('app.pw_change_ok', '', true);
END $$;
REVOKE ALL ON FUNCTION public.complete_password_change() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_password_change() TO authenticated;