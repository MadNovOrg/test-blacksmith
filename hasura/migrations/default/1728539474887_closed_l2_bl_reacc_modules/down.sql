DELETE FROM module_setting
WHERE course_level = 'LEVEL_2'
AND course_type = 'CLOSED'
AND go1_integration = true
AND reaccreditation = true;