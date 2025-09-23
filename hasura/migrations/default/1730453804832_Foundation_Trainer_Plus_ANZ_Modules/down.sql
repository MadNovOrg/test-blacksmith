DELETE FROM module_setting
WHERE course_level = 'FOUNDATION_TRAINER_PLUS' AND shard = 'ANZ';

DELETE FROM module_v2 WHERE name ILIKE '%Foundation Trainer Plus ANZ%';