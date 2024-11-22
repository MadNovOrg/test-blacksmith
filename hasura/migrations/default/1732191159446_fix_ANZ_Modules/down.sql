UPDATE module_setting
SET module_name = 'Small Child and One Person Holds Intermediate Trainer ANZ'
WHERE 
    shard = 'ANZ' 
    AND course_level = 'INTERMEDIATE_TRAINER' 
    AND module_name = 'How to run a Team Teach course Intermediate Trainer ANZ' 
    AND sort = 13;

UPDATE module_v2
SET 
    display_name = 'Seperations'
WHERE display_name = 'Separations' AND name LIKE '%Seperations%' AND name LIKE '%ANZ%';

UPDATE module_v2
SET lessons = jsonb_set(
    lessons, 
    '{items,1,name}', 
    to_jsonb(REPLACE(lessons->'items'->1->>'name', 'Preparation', 'Preperation'))
)
WHERE lessons->'items'->1->>'name' LIKE '%Preparation%' AND name LIKE '%ANZ%';