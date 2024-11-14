DELETE FROM module_setting
WHERE course_level = 'LEVEL_2' AND shard = 'ANZ';

DELETE FROM module_v2 WHERE name ILIKE '%Level Two ANZ%';