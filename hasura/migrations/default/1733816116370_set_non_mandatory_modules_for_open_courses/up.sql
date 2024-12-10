UPDATE module_setting
SET mandatory = false
WHERE module_name NOT IN (
    'Theory',
    'Personal Space & Body Language',
    'Elevated Risks',
    'Physical Warm Up',
    'Level 1 BS Theory',
    'Level 1 BS Personal Space & Body Language',
    'Level 1 BS Elevated Risks'
    'Level 1 BS Physical Warm Up',
    'Theory Level One NP ANZ',
    'Advanced Warm Up',
    'Legal & Health'
)
AND course_level IN ('LEVEL_1', 'LEVEL_2', 'LEVEL_1_BS', 'LEVEL_1_NP', 'ADVANCED')
AND course_type IN ('OPEN', 'CLOSED');
