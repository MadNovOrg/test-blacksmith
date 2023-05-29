CREATE OR REPLACE FUNCTION public.course_code(course_row course)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    strategyCodes text;
    deliveryType text;
    courseType text;
    courseLevel text;
BEGIN
    SELECT prefix INTO courseLevel
    FROM course_level_prefix
    WHERE name = course_row.course_level;

    SELECT prefix INTO courseType
    FROM course_type_prefix
    WHERE name = course_row.course_type;

    SELECT prefix INTO deliveryType
    FROM course_delivery_type_prefix
    WHERE name = course_row.course_delivery_type;

    IF course_row.accredited_by = 'BILD' THEN
        SELECT string_agg(bs.short_name, '') INTO strategyCodes
        FROM course_bild_strategy cbs
        JOIN bild_strategy bs ON cbs.strategy_name = bs.name
        WHERE cbs.course_id = course_row.id;
    END IF;

    RETURN array_to_string(array[
        CASE WHEN course_row.go1_integration = true THEN 'BL' END,
        courseLevel,
        CASE WHEN course_row.reaccreditation THEN 'RE' END,
        CASE WHEN course_row.conversion THEN 'C' END,
        deliveryType,
        courseType,
        strategyCodes
    ], '.') || '-' || course_row.id::text;
END;
$function$;
