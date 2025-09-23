
ALTER TABLE public.org_resource_packs_history 
DROP CONSTRAINT org_resource_packs_history_course_id_fkey;

ALTER TABLE public.org_resource_packs_history 
DROP COLUMN IF EXISTS course_id;

DELETE FROM public.resource_packs_events 
WHERE name = 'RESOURCE_PACKS_RESERVED';

DELETE FROM public.resource_packs_events 
WHERE name = 'RESOURCE_PACKS_PURCHASED';
