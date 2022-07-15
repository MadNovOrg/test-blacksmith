DO
$do$
BEGIN
   -- migrate the data if the data exists and it's old, otherwise it's already up to date (new seeds applied)
   IF EXISTS (SELECT FROM module_group WHERE name = 'Prompts Guides & Separations') THEN
      -- Level 1 F2F duration
        UPDATE module_group_duration
        SET duration = 180
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1');

        UPDATE module_group_duration
        SET duration = 60
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_1');

        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1');

        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1');

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_1'),
                'F2F', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_1'),
                'F2F', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_1'),
                'F2F', 
                false,
                20,
                false);

        -- -- Level 1 F2F with reaccreditation
        UPDATE module_group_duration
        SET duration = 90
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

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_1'),
                'F2F', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_1'),
                'F2F', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_1'),
                'F2F', 
                true,
                15,
                false);

        -- -- Level 1 mixed with reaccreditation
        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                90,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                60,
                false),
                ((SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Safety' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Neck Disengagement' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Small Child and One Person Holds' and course_level = 'LEVEL_1'),
                'MIXED', 
                true,
                30,
                false);

        -- -- Level 1 virtual with reaccreditation
        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                90,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                60,
                false),
                ((SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Safety' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Neck Disengagement' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Small Child and One Person Holds' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                true,
                30,
                false);

        -- Level 1 Virtual, no go1, no reaccreditation
        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                240,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                120,
                false);

        -- -- Level 1 F2F go1 integration
        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1');

        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1');

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_1'),
                'F2F', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_1'),
                'F2F', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_1'),
                'F2F', 
                false,
                20,
                true);

        -- Level 1 virtual with go1 integration
        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                30,
                true),
                ((SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                30,
                true),
                ((SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                30,
                true),
                ((SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                15,
                true),
                ((SELECT id FROM module_group WHERE name = 'Personal Safety' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                30,
                true),
                ((SELECT id FROM module_group WHERE name = 'Neck Disengagement' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                30,
                true),
                ((SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Small Child and One Person Holds' and course_level = 'LEVEL_1'),
                'VIRTUAL', 
                false,
                60,
                true);

        -- Level 2 F2F no go1 integration, no reaccreditation
        UPDATE module_group_duration
        SET duration = 180
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 60
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 30
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' AND course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 90
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Seated Holds' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                90,
                false);

        -- Level 2 Mixed, no go1_integration, no reaccreditation
        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                180,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                60,
                false),
                ((SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                30,
                false),
                ((SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                30,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Safety' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                30,
                false),
                ((SELECT id FROM module_group WHERE name = 'Neck Disengagement' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                30,
                false),
                ((SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Small Child and One Person Holds' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                60,
                false),
                ((SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                90,
                false),
                ((SELECT id FROM module_group WHERE name = 'Seated Holds' and course_level = 'LEVEL_2'),
                'MIXED', 
                false,
                90,
                false);

        -- Level 2 F2F, no go1 integration, with reaccreditation
        UPDATE module_group_duration
        SET duration = 90
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 15
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 15
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 15
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

        UPDATE module_group_duration   
        SET duration = 45
        WHERE course_delivery_type = 'F2F' AND go1_integration = false AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Seated Holds' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                45,
                false);

        -- Level 2 MIXED, no go1 with reaccreditation
        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Theory' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                90,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Space & Body Language' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                60,
                false),
                ((SELECT id FROM module_group WHERE name = 'Elevated Risks' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Physical Warm Up' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Personal Safety' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Neck Disengagement' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                20,
                false),
                ((SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                15,
                false),
                ((SELECT id FROM module_group WHERE name = 'Small Child and One Person Holds' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                30,
                false),
                ((SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                45,
                false),
                ((SELECT id FROM module_group WHERE name = 'Seated Holds' and course_level = 'LEVEL_2'),
                'MIXED', 
                true,
                45,
                false);

        -- Level 2 F2F with go1 integration, without reaccreditation
        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 20
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 90
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = false
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                20,
                true),
                ((SELECT id FROM module_group WHERE name = 'Seated Holds' and course_level = 'LEVEL_2'),
                'F2F', 
                false,
                90,
                true);

        -- Level 2 F2F with go1 integration, with reaccreditation
        UPDATE module_group_duration
        SET duration = 15
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Prompts and Guides' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 15
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Clothing Responses' and course_level = 'LEVEL_2');

        UPDATE module_group_duration
        SET duration = 45
        WHERE course_delivery_type = 'F2F' AND go1_integration = true AND reaccreditation = true
        AND module_group_id = (SELECT id FROM module_group WHERE name = 'Two Person Escorts' and course_level = 'LEVEL_2');

        INSERT INTO module_group_duration (module_group_id, course_delivery_type, reaccreditation, duration, go1_integration)
        VALUES ((SELECT id FROM module_group WHERE name = 'Separations' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                15,
                true),
                ((SELECT id FROM module_group WHERE name = 'Hair Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                15,
                true),
                ((SELECT id FROM module_group WHERE name = 'Bite Responses' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                15,
                true),
                ((SELECT id FROM module_group WHERE name = 'Seated Holds' and course_level = 'LEVEL_2'),
                'F2F', 
                true,
                45,
                true);
   END IF;
END
$do$
