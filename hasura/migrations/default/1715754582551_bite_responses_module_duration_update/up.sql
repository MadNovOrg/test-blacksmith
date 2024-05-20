UPDATE module_setting
SET duration = 15
WHERE module_name LIKE '%Bite Responses%'
AND course_level = 'INTERMEDIATE_TRAINER'
AND reaccreditation = true;
