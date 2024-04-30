UPDATE course
SET name = REPLACE(name, 'Foundation Trainer Plus', '3-Day Safety Responses Trainer')
WHERE name LIKE '%Foundation Trainer Plus%' AND course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_certificate
SET course_name = REPLACE(course_name, 'Foundation Trainer Plus', '3-Day Safety Responses Trainer')
WHERE course_name LIKE '%Foundation Trainer Plus%' AND course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_certificate
SET number = REPLACE(number, 'FTP', 'SRT')
WHERE number LIKE '%FTP%' AND course_level = 'FOUNDATION_TRAINER_PLUS';