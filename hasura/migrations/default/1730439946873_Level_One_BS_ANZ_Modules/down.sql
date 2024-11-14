DELETE FROM module_setting
WHERE course_level = 'LEVEL_1_BS' AND shard = 'ANZ';

DELETE FROM module_v2 WHERE name ILIKE '%Level One BS ANZ%';