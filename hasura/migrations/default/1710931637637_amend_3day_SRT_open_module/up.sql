insert into module_v2 ("name", "display_name", "lessons" )
values (
    'Elevated Risks 3 Day SRT',
    'Elevated Risks',
    '{
        "items": [
            {
                "name": "Positional asphyxia and hyper flexion"
            },
            {
                "name": "Pressure on abdomen and ribcage"
            },
            {
                "name": "Leaning forward"
            },
            {
                "name": "Prone restraint"
            }
        ]
    }'::jsonb
);

update module_setting
set "module_name" = 'Elevated Risks 3 Day SRT'
where "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
    and "module_name" = 'Elevated Risks';