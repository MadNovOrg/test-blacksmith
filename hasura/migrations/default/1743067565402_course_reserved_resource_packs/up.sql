
CREATE INDEX idx_course_id 
ON public.org_resource_packs_history 
USING btree (course_id);

CREATE OR REPLACE FUNCTION public.course_reserved_resource_packs(course_row course)
RETURNS integer
LANGUAGE sql
STABLE
AS $function$
SELECT SUM(ABS(change)) AS total_reserved_licenses
FROM org_resource_packs_history
WHERE course_id = course_row.id
  AND event = 'RESOURCE_PACKS_RESERVED';
$function$;
