UPDATE course
SET name = REPLACE(name, '3-Day Safety Responses Trainer', 'Foundation Trainer Plus')
WHERE name LIKE '%3-Day Safety Responses Trainer%' AND course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_certificate
SET course_name = REPLACE(course_name, '3-Day Safety Responses Trainer', 'Foundation Trainer Plus')
WHERE course_name LIKE '%3-Day Safety Responses Trainer%' AND course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_certificate
SET number = REPLACE(number, 'SRT', 'FTP')
WHERE number LIKE '%SRT%' AND course_level = 'FOUNDATION_TRAINER_PLUS';