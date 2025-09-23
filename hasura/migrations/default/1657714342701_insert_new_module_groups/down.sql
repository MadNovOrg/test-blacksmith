DELETE FROM module
WHERE name = 'Response to dead weight' AND module_group_id = (
    SELECT id FROM module_group
    WHERE name = 'Seated Holds'
    LIMIT 1
);

DELETE FROM module
WHERE name = 'Turn gather guide' AND module_group_id IN (
    SELECT id FROM module_group
    WHERE name = 'Separations'
);

UPDATE module_group
SET name = 'Prompts Guides & Separations'
WHERE name = 'Prompts and Guides';

UPDATE module_group
SET name = 'Clothing Hair & Bite Responses'
WHERE name = 'Clothing Responses';

UPDATE module_group
SET name = 'Two Person Escorts and Seated Holds'
WHERE name = 'Two Person Escorts';

---------
UPDATE module
SET module_group_id = (
    SELECT id FROM module_group
    WHERE name = 'Prompts Guides & Separations' AND course_level = 'LEVEL_1'
    LIMIT 1
)
WHERE course_level = 'LEVEL_1' AND name IN (
    'Punches & kicks',
    'Half shield'
);

UPDATE module
SET module_group_id = (
    SELECT id FROM module_group
    WHERE name = 'Prompts Guides & Separations' AND course_level = 'LEVEL_2'
    LIMIT 1
)
WHERE course_level = 'LEVEL_2' AND name IN (
    'Punches & kicks',
    'Half shield'
);

-- ------
UPDATE module
SET module_group_id = (
    SELECT id FROM module_group
    WHERE name = 'Clothing Hair & Bite Responses' AND course_level = 'LEVEL_1'
    LIMIT 1
)
WHERE course_level = 'LEVEL_1' AND name IN (
    'One handed grab',
    'Two handed grab',
    'Oyster',
    'Knuckle roll',
    'Knuckle slide',
    'Bite responses',
    'Eye bulge',
    'Distraction',
    'Jaw manual manipulation'  
);

UPDATE module
SET module_group_id = (
    SELECT id FROM module_group
    WHERE name = 'Clothing Hair & Bite Responses' AND course_level = 'LEVEL_2'
    LIMIT 1
)
WHERE course_level = 'LEVEL_2' AND name IN (
    'One handed grab',
    'Two handed grab',
    'Oyster',
    'Knuckle roll',
    'Knuckle slide',
    'Bite responses',
    'Eye bulge',
    'Distraction',
    'Jaw manual manipulation'  
);

UPDATE module
SET module_group_id = (
    SELECT id FROM module_group
    WHERE name = 'Two Person Escorts and Seated Holds' AND course_level = 'LEVEL_2'
    LIMIT 1
)
WHERE course_level = 'LEVEL_2' AND name IN (
    'Sitting in hold / bean bag option', 
    'Moving to seated position', 
    'Foot wedge',
    'Responses to kicking',
    'Change of face in seats',
    'Alternative change of face in seated',
    'Small child escorts'
);

DELETE FROM module_group
WHERE name IN ('Separations', 'Hair Responses', 'Bite Responses', 'Seated Holds');