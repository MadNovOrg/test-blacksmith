UPDATE public.course_status
SET name = 'PUBLISHED'
WHERE name = 'SCHEDULED';

UPDATE public.course_status
SET name = 'PENDING'
WHERE name = 'CONFIRM_MODULES';

UPDATE public.course
SET course_status = 'PUBLISHED'
WHERE course_status = 'SCHEDULED';

UPDATE public.course
SET course_status = 'PENDING'
WHERE course_status = 'CONFIRM_MODULES';
