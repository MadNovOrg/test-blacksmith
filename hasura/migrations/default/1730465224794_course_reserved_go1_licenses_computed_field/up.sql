CREATE OR REPLACE FUNCTION public.course_reserved_go1_licenses(course_row course)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
SELECT SUM(ABS(change)) AS total_reserved_licenses
FROM go1_licenses_history
WHERE payload->>'courseId' = course_row.id::TEXT
  AND event = 'LICENSES_RESERVED';
$function$;
