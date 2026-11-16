CREATE TABLE IF NOT EXISTS private.password_snapshots (user_id uuid PRIMARY KEY, hash text, taken_at timestamptz NOT NULL DEFAULT now());
REVOKE ALL ON private.password_snapshots FROM PUBLIC, anon, authenticated;

INSERT INTO private.password_snapshots (user_id, hash)
SELECT p.id, u.encrypted_password FROM public.profiles p JOIN auth.users u ON u.id = p.id
WHERE p.must_change_password
ON CONFLICT (user_id) DO UPDATE SET hash = EXCLUDED.hash, taken_at = now();

CREATE OR REPLACE FUNCTION private.snapshot_password_on_flag()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.must_change_password AND (TG_OP = 'INSERT' OR NOT OLD.must_change_password) THEN
    INSERT INTO private.password_snapshots (user_id, hash)
    SELECT NEW.id, u.encrypted_password FROM auth.users u WHERE u.id = NEW.id
    ON CONFLICT (user_id) DO UPDATE SET hash = EXCLUDED.hash, taken_at = now();
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_snapshot_password_on_flag ON public.profiles;
CREATE TRIGGER trg_snapshot_password_on_flag AFTER INSERT OR UPDATE OF must_change_password ON public.profiles
FOR EACH ROW EXECUTE FUNCTION private.snapshot_password_on_flag();

CREATE OR REPLACE FUNCTION public.complete_password_change()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE old_hash text; cur_hash text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT encrypted_password INTO cur_hash FROM auth.users WHERE id = auth.uid();
  SELECT hash INTO old_hash FROM private.password_snapshots WHERE user_id = auth.uid();
  IF cur_hash IS NULL OR cur_hash = '' OR (old_hash IS NOT NULL AND cur_hash = old_hash) THEN
    RAISE EXCEPTION 'Please set a new password first';
  END IF;
  PERFORM set_config('app.pw_change_ok', 'on', true);
  UPDATE public.profiles SET must_change_password = false WHERE id = auth.uid();
  PERFORM set_config('app.pw_change_ok', '', true);
  DELETE FROM private.password_snapshots WHERE user_id = auth.uid();
END $$;