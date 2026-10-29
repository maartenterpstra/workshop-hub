ALTER TABLE public.abstract_decisions ADD CONSTRAINT abstract_decisions_no_poster CHECK (decision IN ('oral','revise','reject'));
ALTER TABLE public.schedule_slots ADD CONSTRAINT schedule_slots_talks_only CHECK (kind = 'oral');
ALTER TABLE public.reviews ADD CONSTRAINT reviews_no_poster CHECK (recommendation IS DISTINCT FROM 'accept_poster');
ALTER TABLE public.abstracts ADD CONSTRAINT abstracts_no_poster CHECK (status <> 'accepted_poster');