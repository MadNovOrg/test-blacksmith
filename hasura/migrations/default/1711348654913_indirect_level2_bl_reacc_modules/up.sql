INSERT INTO "public"."module_setting" (course_level, reaccreditation, go1_integration, color, duration, course_delivery_type, course_type, module_name, sort, mandatory, conversion)
SELECT 
    course_level,
    true AS reaccreditation,
    go1_integration,
    color,
    duration,
    course_delivery_type,
    course_type,
    module_name,
    sort,
    mandatory,
    conversion
FROM 
    "public"."module_setting"
WHERE 
    course_type = 'INDIRECT'
    AND course_level = 'LEVEL_2'
    AND go1_integration = true
    AND reaccreditation = false
    AND conversion = false
    AND course_delivery_type = 'F2F';
