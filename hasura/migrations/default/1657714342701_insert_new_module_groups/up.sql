DO
$do$
BEGIN
   -- migrate the data if the data exists and it's old, otherwise it's already up to date (new seeds applied)
   IF EXISTS (SELECT FROM module_group WHERE name = 'Prompts Guides & Separations') THEN
      -- insert new module groups, Separations, Hair Responses, Bite Responses
        INSERT INTO module_group (name, course_level, mandatory, color)
        VALUES ('Separations', 'LEVEL_1', false, 'navy'),
        ('Separations', 'LEVEL_2', false, 'navy'),
        ('Hair Responses', 'LEVEL_1', false, 'navy'),
        ('Hair Responses', 'LEVEL_2', false, 'navy'),
        ('Bite Responses', 'LEVEL_1', false, 'navy'),
        ('Bite Responses', 'LEVEL_2', false, 'navy'),
        ('Seated Holds', 'LEVEL_2', false, 'purple');

        INSERT INTO module(name, course_level, module_category, module_group_id)
        VALUES (
                'Response to dead weight', 
                'LEVEL_2', 
                'THEORY', (
                    SELECT id FROM module_group
                    WHERE name = 'Seated Holds' AND course_level = 'LEVEL_2'
                    LIMIT 1
                )
            ), 
            (
                'Turn gather guide',
                'LEVEL_1',
                'THEORY',
                (
                    SELECT id FROM module_group
                    WHERE name = 'Separations' AND course_level = 'LEVEL_1'
                    LIMIT 1
                )
            ),
            (
                'Turn gather guide',
                'LEVEL_2',
                'THEORY',
                (
                    SELECT id FROM module_group
                    WHERE name = 'Separations' AND course_level = 'LEVEL_2'
                    LIMIT 1
                )
            );

        -- Rename old module groups
        UPDATE module_group
        SET name = 'Prompts and Guides'
        WHERE name = 'Prompts Guides & Separations';

        UPDATE module_group
        SET name = 'Clothing Responses'
        WHERE name = 'Clothing Hair & Bite Responses';

        UPDATE module_group
        SET name = 'Two Person Escorts'
        WHERE name = 'Two Person Escorts and Seated Holds';

        -- move Prompts Guides & Separations modules to new Separations module group
        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Separations' AND course_level = 'LEVEL_1'
            LIMIT 1
        )
        WHERE course_level = 'LEVEL_1' AND name IN (
            'Punches & kicks',
            'Half shield'
        );

        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Separations' AND course_level = 'LEVEL_2'
            LIMIT 1
        )
        WHERE course_level = 'LEVEL_2' AND name IN (
            'Punches & kicks',
            'Half shield'
        );

        -- move Clothing Hair & Bite Responses modules to new Hair Responses module group
        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Hair Responses' AND course_level = 'LEVEL_1'
            LIMIT 1
        )
        WHERE course_level = 'LEVEL_1' AND name IN (
            'One handed grab',
            'Two handed grab',
            'Oyster',
            'Knuckle roll',
            'Knuckle slide'
        );

        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Hair Responses' AND course_level = 'LEVEL_2'
            LIMIT 1
        )
        WHERE course_level = 'LEVEL_2' AND name IN (
            'One handed grab',
            'Two handed grab',
            'Oyster',
            'Knuckle roll',
            'Knuckle slide'
        );

        -- move Clothing Hair & Bite Responses modules to new Bite Responses module group
        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Bite Responses' AND course_level = 'LEVEL_1'
            LIMIT 1
        )
        WHERE course_level = 'LEVEL_1' AND name IN (
            'Bite responses',
            'Eye bulge',
            'Distraction',
            'Jaw manual manipulation'
        );

        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Bite Responses' AND course_level = 'LEVEL_2'
            LIMIT 1
        )
        WHERE course_level = 'LEVEL_2' AND name IN (
            'Bite responses',
            'Eye bulge',
            'Distraction',
            'Jaw manual manipulation'
        );

        -- move modules from Two Person Escorts and Seated Holds to new Seated Holds module group
        UPDATE module
        SET module_group_id = (
            SELECT id FROM module_group
            WHERE name = 'Seated Holds' AND course_level = 'LEVEL_2'
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
   END IF;
END
$do$