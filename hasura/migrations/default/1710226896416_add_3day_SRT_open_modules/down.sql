update module_v2
set lessons = '
{"items": [
    {"name": "The Why"},
    {"name": "Values activity"},
    {"name": "The Infinity Cycle"},
    {"name": "Functions of behaviour"},
    {"name": "Behaviours of communication"},
    {"name": "Effective and less effective practice"},
    {"name": "Legal framework"},
    {"name": "Risk assessment"},
    {"name": "Policies, practices & procedures"},
    {"name": "Stages of distress and support"},
    {"name": "Conflict spiral"},
    {"name": "Cycle of influence"},
    {"name": "Fizzy Pop challenge"},
    {"name": "Individual support plans"},
    {"name": "Listening and learning"},
    {"name": "Quiz"}
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
            {"name": "Conductor"},
            {"name": "Clock"}
        ]
    },
    {
        "name": "Neck responses",
        "items": [
            {"name": "Steering wheel"},
            {"name": "Fix and stabilise"},
            {"name": "Windmill"},
            {"name": "Snake"},
            {"name": "Elbow swing"},
            {"name": "Neck brace"},
            {"name": "Bar and brace - behind"},
            {"name": "Elbow guide out of headlock"},
            {"name": "Spin out of strangle"}
        ]
    },
    {
        "name": "Clothing and hair responses",
        "items": [
            {"name": "Fix and stabilise"},
            {"name": "Closed fist hold"},
            {"name": "Tube grip"},
            {"name": "Close to the neck"},
            {"name": "From behind"},
            {"name": "One handed hold"},
            {"name": "Two handed hold"},
            {"name": "Knuckle roll"},
            {"name": "Knuckle slide"}
        ]
    }
]}'::jsonb
where "name" = 'Personal Safety - Assess Risk, Reduce Risk, Gates';

update module_setting
set sort = 6
where "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
    and "module_name" = 'Prompts, Guides & Separations';

update module_setting
set sort = 5
where "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
    and "module_name" = 'Personal Safety - Assess Risk, Reduce Risk, Gates';