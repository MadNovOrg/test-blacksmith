UPDATE module_setting
SET mandatory = true
WHERE course_level = 'LEVEL_1'
AND course_type IN ('CLOSED', 'INDIRECT')
AND module_name = 'Physical Warm Up';