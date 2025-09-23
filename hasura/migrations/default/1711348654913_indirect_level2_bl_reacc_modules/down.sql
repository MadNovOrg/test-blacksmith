DELETE FROM "public"."module_setting"
WHERE course_type = 'INDIRECT'
    AND course_level = 'LEVEL_2'
    AND go1_integration = true
    AND reaccreditation = true
    AND conversion = false
    AND course_delivery_type = 'F2F';
