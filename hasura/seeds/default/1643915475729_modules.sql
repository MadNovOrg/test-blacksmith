INSERT INTO
    module (
        name,
        module_level,
        module_category,
        module_group_id
    )
VALUES (
        'Values Exercise',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Values Exercise',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Legal Framework',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Legal Framework',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Policies Practices & Procedure',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Policies Practices & Procedure',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Understanding Emotions & Behaviour',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Understanding Emotions & Behaviour',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Six Stages Of Crisis',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Six Stages Of Crisis',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Conflict Spiral',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Conflict Spiral',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Fizzy Pop Challenge',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Fizzy Pop Challenge',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Behaviours That Challenge',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Behaviours That Challenge',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'De-escalation Scenario',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'De-escalation Scenario',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Handling Plans',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Handling Plans',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Scripts',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Scripts',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Post Listening & Learning',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Post Listening & Learning',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    ), (
        'Quiz',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 1
        )
    ), (
        'Quiz',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Theory' AND
                module_level = 2
        )
    );



INSERT INTO
    module (
        name,
        module_level,
        module_category,
        module_group_id
    )
VALUES (
        'Circles Of Danger',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 1
        )
    ),
    (
        'Circles Of Danger',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 2
        )
    ),
    (
        'Posturing And Body Language',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 1
        )
    ),
    (
        'Posturing And Body Language',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 2
        )
    ),
    (
        'Experiencing Feeling',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 1
        )
    ),
    (
        'Experiencing Feeling',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 1
        )
    ),
    (
        'Experiencing Feeling',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 2
        )
    ),
    (
        'Calm Stance',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 1
        )
    ),
    (
        'Calm Stance',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 2
        )
    ),
    (
        'Calming Scripts',
        1,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 1
        )
    ),
    (
        'Calming Scripts',
        2,
        'THEORY', (
            SELECT
                id
            FROM
                module_group
            WHERE
                name = 'Personal Space & Body Language' AND
                module_level = 2
        )
    );