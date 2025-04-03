
INSERT INTO public.resource_packs_events (name) 
VALUES ('RESOURCE_PACKS_PURCHASED');

INSERT INTO public.resource_packs_events (name) 
VALUES ('RESOURCE_PACKS_RESERVED');

ALTER TABLE public.org_resource_packs_history 
ADD COLUMN course_id INTEGER NULL;

ALTER TABLE public.org_resource_packs_history
ADD CONSTRAINT org_resource_packs_history_course_id_fkey
FOREIGN KEY (course_id)
REFERENCES public.course (id)
ON UPDATE RESTRICT 
ON DELETE RESTRICT;
