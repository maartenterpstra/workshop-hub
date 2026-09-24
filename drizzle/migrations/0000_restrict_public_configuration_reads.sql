DROP POLICY IF EXISTS "Anyone reads topics" ON public.topics;
CREATE POLICY "Anyone reads submission topics"
ON public.topics
FOR SELECT
TO anon, authenticated
USING (
  name IN (
    'Reconstruction & Synthesis',
    'Segmentation & Registration',
    'Dose & Adaptive Workflows',
    'Clinical Predictions & Outcomes',
    'Foundation Models, Text, Explainability & Uncertainty',
    'Implementation, QA & Ethics'
  )
);

DROP POLICY IF EXISTS "Authenticated users read app config" ON public.app_config;
CREATE POLICY "Authenticated users read active app config"
ON public.app_config
FOR SELECT
TO authenticated
USING (id IS TRUE);