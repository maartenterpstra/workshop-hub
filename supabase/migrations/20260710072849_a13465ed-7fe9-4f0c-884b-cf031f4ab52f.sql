ALTER TABLE public.abstracts ADD COLUMN IF NOT EXISTS figure_paths text[];
UPDATE public.topics SET name = 'Foundation Models, Text, Explainability & Uncertainty' WHERE display_order = 3;