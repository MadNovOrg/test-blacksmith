ALTER TABLE public.go1_licenses_history
ADD COLUMN course_id INTEGER NULL;

UPDATE public.go1_licenses_history
SET course_id = (payload->>'courseId')::integer
WHERE payload IS NOT NULL
  AND payload ? 'courseId'
  AND course_id IS NULL;

ALTER TABLE public.go1_licenses_history
ADD CONSTRAINT go1_licenses_history_course_id_fkey
FOREIGN KEY (course_id)
REFERENCES public.course(id)
ON UPDATE CASCADE
ON DELETE SET NULL;

CREATE INDEX go1_licenses_history_course_id_idx
ON public.go1_licenses_history (course_id);
