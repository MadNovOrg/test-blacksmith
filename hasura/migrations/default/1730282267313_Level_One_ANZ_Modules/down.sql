DELETE FROM module_setting
WHERE course_level = 'LEVEL_1' AND shard = 'ANZ';

DELETE FROM module_v2 WHERE name ILIKE '%Level One ANZ%';