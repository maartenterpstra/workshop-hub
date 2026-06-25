CREATE POLICY "Users self-assign author role" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'author');