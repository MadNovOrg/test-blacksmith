UPDATE module_v2
SET lessons = '{"items": [
        {"name": "Kneeling to front ground recovery"},
        {"name": "Ground position support arms"},
        {"name": "Help with legs"},
        {"name": "Help replacing person at legs"},
        {"name": "Additional feet support"},
        {"name": "Help replacing person at the head (leg side)"},
        {"name": "Help replacing person at head (head side)"},
        {"name": "Hip chair"},
        {"name": "Back ground recovery"},
        {"name": "Help with legs"},
        {"name": "Help with supporting arm"},
        {"name": "Shield hold / escort"},
        {"name": "Cradle sitting shield"},
        {"name": "Ground shield"},
        {"name": "Ground shield into front ground recovery"},
        {"name": "Help with legs in ground shield"},
        {"name": "Help with ground shield into front ground recovery"}
    ]}'::jsonb
WHERE name = 'Ground Recovery Safeguards';