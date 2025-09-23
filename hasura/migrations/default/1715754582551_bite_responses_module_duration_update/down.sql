UPDATE module_setting
SET duration = 2150
WHERE module_name LIKE '%Bite Responses%'
AND course_level = 'INTERMEDIATE_TRAINER'
AND reaccreditation = true;