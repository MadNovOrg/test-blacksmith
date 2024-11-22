-- REMOVE DUPLICATED MODULES, AND REPLACE THEM WITH THE CORRECT ONE (TTHP-4477)
UPDATE module_setting
SET module_name = 'How to run a Team Teach course Intermediate Trainer ANZ'
WHERE 
    shard = 'ANZ' 
    AND course_level = 'INTERMEDIATE_TRAINER' 
    AND module_name = 'Small Child and One Person Holds Intermediate Trainer ANZ' 
    AND sort = 13;


-- UPDATE MODULE WORDING FROM Seperations TO Separations (TTHP-4693)

UPDATE module_v2
SET 
    display_name = 'Separations'
WHERE display_name = 'Seperations' AND name LIKE '%Seperations%' AND name LIKE '%ANZ%';

-- UPDATE MODULE LESSONS WORDING FROM Preperation TO Preparation (TTHP-4693)
UPDATE module_v2
SET lessons = jsonb_set(
    lessons, 
    '{items,1,name}', 
    to_jsonb(REPLACE(lessons->'items'->1->>'name', 'Preperation', 'Preparation'))
)
WHERE lessons->'items'->1->>'name' LIKE '%Preperation%' AND name LIKE '%ANZ%';
