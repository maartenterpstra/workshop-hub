CREATE OR REPLACE FUNCTION private.is_abstract_coauthor(_abstract_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.abstract_authors au
    JOIN auth.users u ON u.id = auth.uid()
    WHERE au.abstract_id = _abstract_id
      AND u.email_confirmed_at IS NOT NULL
      AND au.email IS NOT NULL
      AND lower(trim(au.email)) = lower(u.email)
  )
$$;
REVOKE EXECUTE ON FUNCTION private.is_abstract_coauthor(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION private.is_abstract_coauthor(uuid) TO authenticated, service_role;

CREATE POLICY "Co-authors read abstracts" ON public.abstracts FOR SELECT TO authenticated
  USING (private.is_abstract_coauthor(id));
CREATE POLICY "Co-authors read abstract authors" ON public.abstract_authors FOR SELECT TO authenticated
  USING (private.is_abstract_coauthor(abstract_id));
CREATE POLICY "Co-authors read disclosures" ON public.abstract_disclosures FOR SELECT TO authenticated
  USING (private.is_abstract_coauthor(abstract_id));
CREATE POLICY "Co-authors read sent decisions" ON public.abstract_decisions FOR SELECT TO authenticated
  USING (emailed_at IS NOT NULL AND private.is_abstract_coauthor(abstract_id));
CREATE POLICY "Co-authors read abstract files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'abstracts' AND EXISTS (
    SELECT 1 FROM public.abstracts a
    WHERE (a.file_path = objects.name OR objects.name = ANY (a.figure_paths))
      AND private.is_abstract_coauthor(a.id)));