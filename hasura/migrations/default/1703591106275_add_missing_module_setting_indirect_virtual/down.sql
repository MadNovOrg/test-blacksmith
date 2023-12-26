DELETE FROM module_setting
WHERE course_level = 'LEVEL_1'
AND course_delivery_type = 'VIRTUAL'
AND course_type = 'INDIRECT'
AND reaccreditation = false
AND go1_integration = false;