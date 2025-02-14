UPDATE module_setting
SET course_delivery_type = 'MIXED' WHERE course_level = 'FOUNDATION_TRAINER_PLUS' AND course_type = 'OPEN' AND course_delivery_type = 'VIRTUAL' AND shard = 'UK';


INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
-- OPEN
    -- F2F
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK'),

    -- MIXED
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Theory Foundation Trainer Plus UK', 1, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Personal Space & Body Language Foundation Trainer Plus UK', 2, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Elevated Risks Foundation Trainer Plus UK', 3, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Physical Warm Up Foundation Trainer Plus UK', 4, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Arm responses Foundation Trainer Plus UK', 5, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Bite responses Foundation Trainer Plus UK', 6, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Foundation Trainer Plus UK', 7, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Hair responses Foundation Trainer Plus UK', 8, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Prompts and Guides Foundation Trainer Plus UK', 9, true, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Small children support Foundation Trainer Plus UK', 10, false, false, 'UK'),
        ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Separations Foundation Trainer Plus UK', 11, false, false, 'UK')