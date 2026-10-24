CREATE POLICY "Authors insert disclosures during revision" ON public.abstract_disclosures FOR INSERT TO authenticated
  WITH CHECK (private.revision_open(abstract_id));
CREATE POLICY "Authors update disclosures during revision" ON public.abstract_disclosures FOR UPDATE TO authenticated
  USING (private.revision_open(abstract_id)) WITH CHECK (private.revision_open(abstract_id));