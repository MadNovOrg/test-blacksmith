DELETE FROM module_setting
WHERE course_level = 'FOUNDATION_TRAINER_PLUS' AND course_type = 'OPEN' AND shard = 'UK' AND reaccreditation = true;

UPDATE module_setting
SET course_delivery_type = 'VIRTUAL' 
WHERE course_level = 'FOUNDATION_TRAINER_PLUS' AND course_type = 'OPEN' AND course_delivery_type = 'MIXED' AND shard = 'UK';