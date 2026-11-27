CREATE TABLE private.mailbox_verifications (
  user_id uuid PRIMARY KEY,
  email text NOT NULL,
  token_hash text,
  token_expires_at timestamptz,
  verified_at timestamptz,
  sent_at timestamptz
);
REVOKE ALL ON private.mailbox_verifications FROM public, anon, authenticated;
GRANT ALL ON private.mailbox_verifications TO service_role;

CREATE OR REPLACE FUNCTION private.is_abstract_coauthor(_abstract_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.abstract_authors au
    JOIN auth.users u ON u.id = auth.uid()
    JOIN private.mailbox_verifications mv ON mv.user_id = u.id
    WHERE au.abstract_id = _abstract_id
      AND mv.verified_at IS NOT NULL
      AND lower(mv.email) = lower(u.email)
      AND au.email IS NOT NULL
      AND lower(trim(au.email)) = lower(u.email)
  )
$$;

CREATE OR REPLACE FUNCTION public.mailbox_send_token(_token_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN RETURN false; END $$;
DROP FUNCTION public.mailbox_send_token(text);

CREATE OR REPLACE FUNCTION public.my_mailbox_verified()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM private.mailbox_verifications mv JOIN auth.users u ON u.id = mv.user_id
    WHERE mv.user_id = auth.uid() AND mv.verified_at IS NOT NULL AND lower(mv.email) = lower(u.email))
$$;
REVOKE EXECUTE ON FUNCTION public.my_mailbox_verified() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.my_mailbox_verified() TO authenticated;

CREATE OR REPLACE FUNCTION public.my_coauthor_count()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(DISTINCT au.abstract_id)::int FROM public.abstract_authors au
  JOIN public.abstracts a ON a.id = au.abstract_id
  JOIN auth.users u ON u.id = auth.uid()
  WHERE a.submitted_by <> u.id AND au.email IS NOT NULL AND lower(trim(au.email)) = lower(u.email)
$$;
REVOKE EXECUTE ON FUNCTION public.my_coauthor_count() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.my_coauthor_count() TO authenticated;