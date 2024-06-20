CREATE OR REPLACE FUNCTION public.merge_course_rows(course_row course)
RETURNS text
LANGUAGE plpgsql
STABLE
AS $function$
BEGIN
    RETURN (
        SELECT COALESCE(c.id::text || ' ', '') ||
               COALESCE(c.name || ' ', '') ||
               COALESCE(o.name || ' ', '') ||
               COALESCE(v.name || ' ', '') ||
               COALESCE(v.city || ' ', '') ||
               COALESCE(v.address_line_one || ' ', '') ||
               COALESCE(v.address_line_two || ' ', '') ||
               COALESCE(v.country || ' ', '') ||
               COALESCE(v.post_code || ' ', '') ||
               COALESCE(c.course_code || ' ', '') ||
               COALESCE(c."arloReferenceId" || ' ', '') ||
               COALESCE(
                   (SELECT string_agg(
                       t._given_name || ' ' || t._family_name || ' ' || 
                       COALESCE(t.translated_family_name, '') || ' ' ||
                       COALESCE(t.translated_given_name, ''), 
                       ' '
                    )
                    FROM course_trainer AS ct 
                    JOIN profile AS t ON ct.profile_id = t.id 
                    WHERE ct.course_id = c.id
                   ) || ' ', ''
               )
        FROM course AS c
        LEFT JOIN organization AS o ON c.organization_id = o.id
        LEFT JOIN course_schedule AS cs ON cs.course_id = c.id
        LEFT JOIN venue AS v ON cs.venue_id = v.id
        WHERE c.id = course_row.id
    );
END;
$function$;
