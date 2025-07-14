DROP INDEX IF EXISTS public.igo1_licenses_history_course_id_idx;

ALTER TABLE public.go1_licenses_history
DROP CONSTRAINT IF EXISTS go1_licenses_history_course_id_fkey;

ALTER TABLE public.go1_licenses_history
DROP COLUMN IF EXISTS course_id;
