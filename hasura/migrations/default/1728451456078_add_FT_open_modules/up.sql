INSERT INTO module_v2("display_name", "name", "lessons") VALUES
('Theory', 'Foundation Trainer Theory', '{
  "items": [
    {
      "name": "Our Why"
    },
    {
      "name": "Values"
    },
    {
      "name": "Behaviours of Communication"
    },
    {
      "name": "Functions of Behaviour"
    },
    {
      "name": "Law, Guidance & Best Practice"
    },
    {
      "name": "Stages of Distress and Support"
    },
    {
      "name": "Individual Support Planning"
    },
    {
      "name": "Conflict Spiral and Cycle of Influence"
    },
    {
      "name": "Fizzy Pop Challenge"
    },
    {
      "name": "Listening and Learning"
    },
    {
      "name": "Quiz"
    }
  ]
}'),
('Communication', 'Foundation Trainer Communication', '{
  "items": [
    {
      "name": "Personal Space, Body Language & Calm Stance"
    },
    {
      "name": "Circles of Awareness and Danger"
    },
    {
      "name": "Verbal Communication & Help Scripts"
    },
    {
      "name": "CALM Communication"
    }
  ]
}'),
('Presentation', 'Foundation Trainer Presentation', '{
  "items": [
    {
      "name": "Theory presentation"
    }
  ]
}'),
('How to run a Team Teach course', 'Foundation Trainer How to run a Team Teach course', '{
  "items": [
    {
      "name": "Team Teach Connect"
    },
    {
      "name": "Course Preparation"
    },
    {
      "name": "Materials"
    },
    {
      "name": "Utilising the Knowledge Hub"
    }
  ]
}');

INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion") VALUES
('FOUNDATION_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer Theory', 1, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer Theory', 1, true, false),

('FOUNDATION_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer Communication', 2, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer Communication', 2, true, false),


('FOUNDATION_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer Presentation', 3, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer Presentation', 3, true, false),


('FOUNDATION_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer How to run a Team Teach course', 4, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Foundation Trainer How to run a Team Teach course', 4, true, false),

('FOUNDATION_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer Theory', 1, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer Theory', 1, true, false),

('FOUNDATION_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer Communication', 2, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer Communication', 2, true, false),


('FOUNDATION_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer Presentation', 3, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer Presentation', 3, true, false),


('FOUNDATION_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer How to run a Team Teach course', 4, true, false),
('FOUNDATION_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Foundation Trainer How to run a Team Teach course', 4, true, false);


