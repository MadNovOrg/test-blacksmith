UPDATE "public"."module_setting"
SET sort = 12
WHERE
    course_type = 'INDIRECT'
    AND course_level = 'LEVEL_2'
    AND go1_integration = true
    AND reaccreditation = true
    AND conversion = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Seated Holds';
