
-- 1. Private schema for security-definer helpers
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. Recreate all policies that referenced public.has_role, now using private.has_role

-- abstract_authors
DROP POLICY IF EXISTS "SOC and admins read all abstract authors" ON public.abstract_authors;
CREATE POLICY "SOC and admins read all abstract authors"
ON public.abstract_authors FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

-- abstracts
DROP POLICY IF EXISTS "SOC and admins read all abstracts" ON public.abstracts;
CREATE POLICY "SOC and admins read all abstracts"
ON public.abstracts FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "SOC and admins update abstracts" ON public.abstracts;
CREATE POLICY "SOC and admins update abstracts"
ON public.abstracts FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "SOC and admins read all profiles" ON public.profiles;
CREATE POLICY "SOC and admins read all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

-- review_assignments
DROP POLICY IF EXISTS "SOC and admins delete assignments" ON public.review_assignments;
CREATE POLICY "SOC and admins delete assignments"
ON public.review_assignments FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "SOC and admins insert assignments" ON public.review_assignments;
CREATE POLICY "SOC and admins insert assignments"
ON public.review_assignments FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "SOC and admins read all assignments" ON public.review_assignments;
CREATE POLICY "SOC and admins read all assignments"
ON public.review_assignments FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "SOC and admins update assignments" ON public.review_assignments;
CREATE POLICY "SOC and admins update assignments"
ON public.review_assignments FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

-- Reviewer's own-update policy: prevent reassignment via WITH CHECK
DROP POLICY IF EXISTS "Reviewers update own assignment status" ON public.review_assignments;
CREATE POLICY "Reviewers update own assignment status"
ON public.review_assignments FOR UPDATE TO authenticated
USING (reviewer_id = auth.uid())
WITH CHECK (reviewer_id = auth.uid());

-- reviews
DROP POLICY IF EXISTS "SOC and admins read all reviews" ON public.reviews;
CREATE POLICY "SOC and admins read all reviews"
ON public.reviews FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'soc') OR private.has_role(auth.uid(), 'admin'));

-- topics
DROP POLICY IF EXISTS "SOC and admins manage topics" ON public.topics;
CREATE POLICY "SOC and admins manage topics"
ON public.topics FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'soc'))
WITH CHECK (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'soc'));

-- user_roles
DROP POLICY IF EXISTS "Admins delete roles" ON public.user_roles;
CREATE POLICY "Admins delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins insert roles" ON public.user_roles;
CREATE POLICY "Admins insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read all roles" ON public.user_roles;
CREATE POLICY "Admins read all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update roles" ON public.user_roles;
CREATE POLICY "Admins update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- 3. Drop the now-unused public.has_role so it isn't RPC-exposed
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
