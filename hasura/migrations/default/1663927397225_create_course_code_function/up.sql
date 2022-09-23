CREATE OR REPLACE FUNCTION public.course_code(course_row course)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
   SELECT course_type_prefix.prefix || '-' || course_level_prefix.prefix || '-' || course_row.id 
   FROM course
   JOIN course_type_prefix ON course.course_type = course_type_prefix.name
   JOIN course_level_prefix ON course.course_level = course_level_prefix.name
WHERE course_type_prefix.name = course_row.course_type AND course_level_prefix.name = course_row.course_level;
$function$;
