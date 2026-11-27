CREATE OR REPLACE FUNCTION public.mailbox_store_token(_user_id uuid, _email text, _token_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM private.mailbox_verifications WHERE user_id = _user_id AND sent_at > now() - interval '5 minutes') THEN
    RETURN false;
  END IF;
  INSERT INTO private.mailbox_verifications (user_id, email, token_hash, token_expires_at, sent_at, verified_at)
  VALUES (_user_id, _email, _token_hash, now() + interval '24 hours', now(), NULL)
  ON CONFLICT (user_id) DO UPDATE SET email = excluded.email, token_hash = excluded.token_hash,
    token_expires_at = excluded.token_expires_at, sent_at = now(), verified_at = NULL;
  RETURN true;
END $$;
CREATE OR REPLACE FUNCTION public.mailbox_confirm(_user_id uuid, _email text, _token_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE private.mailbox_verifications SET verified_at = now(), token_hash = NULL
  WHERE user_id = _user_id AND token_hash = _token_hash AND token_expires_at > now() AND lower(email) = lower(_email);
  RETURN FOUND;
END $$;
REVOKE EXECUTE ON FUNCTION public.mailbox_store_token(uuid, text, text) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mailbox_confirm(uuid, text, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mailbox_store_token(uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mailbox_confirm(uuid, text, text) TO service_role;