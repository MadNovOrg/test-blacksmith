update module_v2
set lessons = '
{"items": [
    {"name": "The Why"},
    {"name": "Values"},
    {"name": "Behaviours of communication"},
    {"name": "Law and guidance"},
    {"name": "Stages of distress and support"},
    {"name": "Conflict spiral and cycle of influence"},
    {"name": "Listening and learning"},
    {"name": "Quiz and evaluation"}
]}'::jsonb
where "name" = 'Three Day Safety Response Trainer Theory';

update module_v2
set lessons = '
{"items": [
    {
        "name": "Arm responses",
        "items": [
            {"name": "Side step in"},
            {"name": "Drop elbow"},
            {"name": "Pump"},
            {"name": "Conductor"}
        ]
    },
    {
        "name": "Neck responses",
        "items": [
            {"name": "Fix and stabilise"},
            {"name": "Windmill"},
            {"name": "Snake"}
        ]
    },
    {
        "name": "Clothing responses",
        "items": [
            {"name": "Closed fist hold"},
            {"name": "Tube grip"},
            {"name": "Close to the neck"}
        ]
    },
    {
        "name": "Hair responses",
        "items": [
            {"name": "One handed grab"},
            {"name": "Oyster"},
            {"name": "Knuckle roll"},
            {"name": "Knuckle slide"}
        ]
    }
]}'::jsonb
where "name" = 'Personal Safety - Assess Risk, Reduce Risk, Gates';

update module_setting
set sort = 5
where "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
    and "module_name" = 'Prompts, Guides & Separations';

update module_setting
set sort = 6
where "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
    and "module_name" = 'Personal Safety - Assess Risk, Reduce Risk, Gates';

