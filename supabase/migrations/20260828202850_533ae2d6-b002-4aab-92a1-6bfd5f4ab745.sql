-- 1. app_config: restrict reads to authenticated users only
DROP POLICY IF EXISTS "Anyone reads app config" ON public.app_config;
CREATE POLICY "Authenticated users read app config"
ON public.app_config FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.app_config FROM anon;

-- 2. abstract_authors: explicit SOC/admin write coverage, reviewers remain blinded
CREATE POLICY "SOC and admins insert abstract authors"
ON public.abstract_authors FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'soc'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SOC and admins update abstract authors"
ON public.abstract_authors FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'soc'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'soc'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SOC and admins delete abstract authors"
ON public.abstract_authors FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'soc'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role));

-- 3. user_roles: remove client self-assignment, grant author role server-side on profile creation
DROP POLICY IF EXISTS "Users self-assign author role" ON public.user_roles;
REVOKE INSERT ON public.user_roles FROM authenticated;

CREATE OR REPLACE FUNCTION private.grant_default_author_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'author'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.grant_default_author_role() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS grant_default_author_role ON public.profiles;
CREATE TRIGGER grant_default_author_role
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION private.grant_default_author_role();