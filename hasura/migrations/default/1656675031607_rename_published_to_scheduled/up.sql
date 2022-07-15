UPDATE public.course_status 
SET name = 'SCHEDULED' 
WHERE name = 'PUBLISHED';

UPDATE public.course_status 
SET name = 'CONFIRM_MODULES' 
WHERE name = 'PENDING';

UPDATE public.course 
SET course_status = 'SCHEDULED' 
WHERE course_status = 'PUBLISHED';

UPDATE public.course 
SET course_status = 'CONFIRM_MODULES' 
WHERE course_status = 'PENDING';
