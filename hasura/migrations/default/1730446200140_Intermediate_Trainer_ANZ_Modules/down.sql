DELETE FROM module_setting
WHERE course_level = 'INTERMEDIATE_TRAINER' AND shard = 'ANZ';

DELETE FROM module_v2 WHERE name ILIKE '%Intermediate Trainer ANZ%';