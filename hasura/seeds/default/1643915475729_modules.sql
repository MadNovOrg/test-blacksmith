INSERT INTO
    module (
        name,
        course_level,
        module_category,
        module_group_id
    )
VALUES (
        'Values Exercise',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Values Exercise',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Legal Framework',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Legal Framework',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Policies Practices & Procedure',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Policies Practices & Procedure',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Understanding Emotions & Behaviour',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Understanding Emotions & Behaviour',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Six Stages Of Crisis',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Six Stages Of Crisis',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Conflict Spiral',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Conflict Spiral',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Fizzy Pop Challenge',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Fizzy Pop Challenge',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Behaviours That Challenge',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Behaviours That Challenge',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'De-escalation Scenario',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'De-escalation Scenario',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Handling Plans',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Handling Plans',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Scripts',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Scripts',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Post Listening & Learning',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Post Listening & Learning',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    ), (
        'Quiz',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_1'
        )
    ), (
        'Quiz',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                course_level = 'LEVEL_2'
        )
    );



INSERT INTO
    module (
        name,
        course_level,
        module_category,
        module_group_id
    )
VALUES (
        'Circles Of Danger',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_1'
        )
    ),
    (
        'Circles Of Danger',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_2'
        )
    ),
    (
        'Posturing And Body Language',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_1'
        )
    ),
    (
        'Posturing And Body Language',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_2'
        )
    ),
    (
        'Experiencing Feeling',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_1'
        )
    ),
    (
        'Experiencing Feeling',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_2'
        )
    ),
    (
        'Calm Stance',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_1'
        )
    ),
    (
        'Calm Stance',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_2'
        )
    ),
    (
        'Calming Scripts',
        'LEVEL_1',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_1'
        )
    ),
    (
        'Calming Scripts',
        'LEVEL_2',
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                course_level = 'LEVEL_2'
        )
    );
