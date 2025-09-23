-- Level 1 F2F duration
UPDATE module_group_duration
SET duration = 120
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 120
WHERE  course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 40
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 60
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id IN (SELECT id FROM module_group WHERE name in ('Separations', 'Hair Responses', 'Bite Responses') and course_level = 'LEVEL_1');

-- -- Level 1 F2F with reaccreditation
UPDATE module_group_duration
SET duration = 60
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 15
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 15
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 15
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 15
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id IN (SELECT id FROM module_group WHERE name in ('Separations', 'Hair Responses', 'Bite Responses') and course_level = 'LEVEL_1');

-- -- Level 1 mixed / virtual with reaccreditation
DELETE FROM module_group_duration
WHERE course_delivery_type in ('MIXED', 'VIRTUAL')
AND reaccreditation = true AND go1_integration = false
AND module_group_id in (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_1'
        AND name in (
                'Theory', 
                'Personal Space & Body Language', 
                'Elevated Risks',
                'Physical Warm Up',
                'Personal Safety',
                'Neck Disengagement',
                'Prompts and Guides',
                'Separations',
                'Clothing Responses',
                'Hair Responses',
                'Bite Responses',
                'Small Child and One Person Holds'
        )
);

-- Level 1 virtual, no go1, no reaccreditation
DELETE FROM module_group_duration
WHERE course_delivery_type = 'VIRTUAL'
AND reaccreditation = false AND go1_integration = false
AND module_group_id in (
        SELECT id 
        FROM module_group
        WHERE course_level = 'LEVEL_1'
        AND name in ('Theory', 'Personal Space & Body Language')
);

-- -- Level 1 F2F go1 integration
UPDATE module_group_duration
SET duration = 40
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1');

UPDATE module_group_duration
SET duration = 60
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
AND module_group_id IN (
        SELECT id FROM module_group
        WHERE course_level = 'LEVEL_1' and name IN ('Separations', 'Hair Responses', 'Bite Responses')
);

-- Level 1 virtual with go1 integration
DELETE FROM module_group_duration
WHERE course_delivery_type = 'VIRTUAL'
AND go1_integration = true AND reaccreditation = false
AND module_group_id IN (
        SELECT id FROM module_group
        WHERE course_level = 'LEVEL_1' AND name IN (
                'Theory',
                'Personal Space & Body Language',
                'Elevated Risks',
                'Physical Warm Up',
                'Personal Safety',
                'Neck Disengagement',
                'Prompts and Guides',
                'Separations',
                'Clothing Responses',
                'Hair Responses',
                'Bite Responses',
                'Small Child and One Person Holds'
        )
);

-- Level 2 F2F no go1 integration, no reaccreditation
UPDATE module_group_duration
SET duration = 120
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 120
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 15
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 40
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' AND course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 60
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 180
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
AND module_group_id IN (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_2' AND name IN (
                'Separations',
                'Hair Responses',
                'Bite Responses',
                'Seated Holds'
        )
);

-- Level 2 Mixed, no go1_integration, no reaccreditation
DELETE FROM module_group_duration
WHERE course_delivery_type = 'MIXED' AND go1_integration = false AND reaccreditation = false
AND module_group_id in (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_2' AND name IN (
                'Theory',
                'Personal Space & Body Language',
                'Elevated Risks',
                'Physical Warm Up',
                'Personal Safety',
                'Neck Disengagement',
                'Prompts and Guides',
                'Separations',
                'Clothing Responses',
                'Hair Responses',
                'Bite Responses',
                'Small Child and One Person Holds',
                'Two Person Escorts',
                'Seated Holds'
        )
);

-- Level 2 F2F, no go1 integration, with reaccreditation
UPDATE module_group_duration
SET duration = 90
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 45
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 30
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 45
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 90
WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' and go1_integration = false and reaccreditation = true
AND module_group_id IN (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_2' AND name IN (
                'Separations',
                'Hair Responses',
                'Bite Responses',
                'Seated Holds'
        )
);

-- Level 2 MIXED, no go1 with reaccreditation
DELETE FROM module_group_duration
WHERE course_delivery_type = 'MIXED' AND go1_integration = false AND reaccreditation = true
AND module_group_id in (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_2' AND name IN (
                'Theory',
                'Personal Space & Body Language',
                'Elevated Risks',
                'Physical Warm Up',
                'Personal Safety',
                'Neck Disengagement',
                'Prompts and Guides',
                'Separations',
                'Clothing Responses',
                'Hair Responses',
                'Bite Responses',
                'Small Child and One Person Holds',
                'Two Person Escorts',
                'Seated Holds'
        )
);

-- Level 2 F2F with go1 integration, without reaccreditation
UPDATE module_group_duration
SET duration = 40
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 60
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 180
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' and go1_integration = true and reaccreditation = false
AND module_group_id IN (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_2' AND name IN (
                'Separations',
                'Hair Responses',
                'Bite Responses',
                'Seated Holds'
        )
);

-- Level 2 F2F with go1 integration, with reaccreditation
UPDATE module_group_duration
SET duration = 30
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 45
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

UPDATE module_group_duration
SET duration = 90
WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = true
AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

DELETE FROM module_group_duration
WHERE course_delivery_type = 'F2F' and go1_integration = true and reaccreditation = true
AND module_group_id IN (
        SELECT id
        FROM module_group
        WHERE course_level = 'LEVEL_2' AND name IN (
                'Separations',
                'Hair Responses',
                'Bite Responses',
                'Seated Holds'
        )
);