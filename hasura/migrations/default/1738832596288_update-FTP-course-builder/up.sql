CREATE INDEX idx_module_name_fulltext ON module_setting USING gin(to_tsvector('english', module_name));
DELETE FROM module_setting
WHERE course_level = 'FOUNDATION_TRAINER_PLUS'
AND NOT to_tsvector('english', module_name) @@ to_tsquery('english', 'Foundation & Trainer & Plus & UK')
AND NOT to_tsvector('english', module_name) @@ to_tsquery('english', 'Foundation & Trainer & Plus & ANZ');


INSERT INTO module_v2("display_name", "name", "lessons") VALUES
('Theory', 'Theory Foundation Trainer Plus UK', '{
    "items": [
        {
            "name": "The Why"
        },
        {
            "name": "Values"
        },
        {
            "name": "Behaviours of communication"
        },
        {
            "name": "Law and guidance"
        },
        {
            "name": "Stages of distress and support"
        },
        {
            "name": "Conflict spiral and cycle of influence"
        },
        {
            "name": "Listening and learning"
        },
        {
            "name": "Quiz and evaluation"
        }
    ]
}'),
('Personal Space & Body Language', 'Personal Space & Body Language Foundation Trainer Plus UK', '{
    "items": [
        {
            "name": "Circles of awareness and danger"
        },
        {
            "name": "Posturing, non-verbal and verbal communication"
        },
        {
            "name": "Calm  stance"
        },
        {
            "name": "Calming scripts"
        }
    ]
}'),
('Elevated Risks', 'Elevated Risks Foundation Trainer Plus UK', '{
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
}'),
('Physical Warm Up', 'Physical Warm Up Foundation Trainer Plus UK', '{
    "items": [
        {
            "name": "Pulse raisers"
        },
        {
            "name": "Stretches"
        },
        {
            "name": "Rowboat and ride bike"
        },
        {
            "name": "Pass ball"
        },
        {
            "name": "Sensitivity of fingers"
        },
        {
            "name": "Circle of friends"
        }
    ]
}'),
('Arm responses','Arm responses Foundation Trainer Plus UK','{
    "items": [
        {
            "name": "Side step in"
        },
        {
            "name": "Drop elbow"
        },
        {
            "name": "Pump"
        },
        {
            "name": "Conductor"
        }
    ]
}'),
('Bite responses','Bite responses Foundation Trainer Plus UK','{
    "items": [
        {
            "name": "Distraction"
        },
        {
            "name": "Assertive Guide with Head Support"
        },
        {
            "name": "Jaw Release"
        }
    ]
}'),
('Clothing responses','Clothing responses Foundation Trainer Plus UK','{
    "items": [
        {
            "name": "Closed fist hold"
        },
        {
            "name": "Tube grip"
        },
        {
            "name": "Close to the neck"
        }
    ]
}'),
('Hair responses','Hair responses Foundation Trainer Plus UK','{
    "items": [
        {
            "name": "One handed grab"
        },
        {
            "name": "Oyster"
        },
        {
            "name": "Knuckle roll"
        },
        {
            "name": "Knuckle slide"
        }
    ]
}'),
('Prompts and Guides', 'Prompts and Guides Foundation Trainer Plus UK', '{
    "items": [
        {
            "name": "Show and go"
        },
        {
            "name": "Caring C guide"
        },
        {
            "name": "Steering away"
        },
        {
            "name": "Punches and kicks"
        }
    ]
}'),
('Small children support', 'Small children support Foundation Trainer Plus UK', '{
    "items": [
        {
            "name": "Show and go"
        },
        {
            "name": "Caring C guide"
        },
        {
            "name": "Help Hug"
        },
        {
            "name": "Support to bean bag"
        }
    ]
}'),
('Separations', 'Separations Foundation Trainer Plus UK', '{
    "items": [
        {
            "name": "Turn gather guide "
        },
        {
            "name": "Half shield"
        },
        {
            "name": "Arm waltz "
        }
    ]
}');

INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
-- OPEN
    -- F2F
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK'),

    -- VIRTUAL
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK'),

-- CLOSED
    -- F2F
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK'),

        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK'),

    -- MIXED
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK'),

        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK');