INSERT INTO module_v2("name", "lessons")
VALUES (
    'Prompts and Guides',
    '{"items": [
        {"name": "Show and go"},
        {"name": "Caring C guide"},
        {"name": "Turn gather guide"},
        {"name": "Steering away"},
        {"name": "Arm waltz"}
    ]}'::jsonb
);

UPDATE module_setting
SET module_name = 'Prompts and Guides'
WHERE course_level IN ('LEVEL_1', 'LEVEL_2') 
AND module_name = 'Prompts & Guides';