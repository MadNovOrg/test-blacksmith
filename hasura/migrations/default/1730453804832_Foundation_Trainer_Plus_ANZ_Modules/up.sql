INSERT INTO module_v2("display_name", "name", "lessons") VALUES 
('Theory', 'Theory Foundation Trainer Plus ANZ', '{
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
      "name": "Confilict Spiral and Cycle of Influence"
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
 ('Communication', 'Communication Foundation Trainer Plus ANZ', '{
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
 ('Physical Warm Up', 'Physical Warm Up Foundation Trainer Plus ANZ', '{
  "items": [
    {
      "name": "Pulse raisers"
    },
    {
      "name": "Stretches"
    },
    {
      "name": "Sensitivity & Communication"
    }
  ]
}'),
 ('Elevated Risks', 'Elevated Risks Foundation Trainer Plus ANZ', '{
  "items": [
    {
      "name": "Positional Asphyxia & Hyper Flexion"
    },
    {
      "name": "Pressure on Abdomen & Ribcage"
    },
    {
      "name": "Leaning Forward"
    },
    {
      "name": "Prone Restraint"
    }
  ]
}'),
 ('Personal Safety Modules - Assess Risk, Reduce Risk, Gates','Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ','{
  "items": [
    {
      "name": "Arm responses",
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
    },
    {
      "name": "Clothing responses",
      "items": [
        {
          "name": "Fix and Stabilise"
        },
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
    },
    {
      "name": "Hair responses",
      "items": [
        {
          "name": "Fix and Stabilise"
        },
        {
          "name": "Oyster"
        },
        {
          "name": "Knuckle Roll"
        },
        {
          "name": "Knuckle Slide"
        }
      ]
    },
    {
      "name": "Bite Responses",
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
    }
  ]
}'),
('Prompts and Guides','Prompts and Guides Foundation Trainer Plus ANZ', '{
      "items": [
        {
          "name": "Show and go"
        },
        {
          "name": "Caring C guide"
        },
        {
          "name": "Help Hug"
        }
      ]
}'),
('Supporting Small Children','Supporting Small Children Foundation Trainer Plus ANZ','{
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
          "name": "Support to Beanbag or Chair"
        }
      ]
}'),
('Seperations', 'Seperations Foundation Trainer Plus ANZ', '{
      "items": [
        {
          "name": "Turn Gather Guide"
        },
        {
          "name": "Half Shield"
        },
        {
          "name": "Arm Waltz"
        }
      ]
}'),
('Presentations', 'Presentations Foundation Trainer Plus ANZ', '{
      "items": [
        {
          "name": "Theory Presentation"
        },
        {
          "name": "Practical Presentation"
        }
      ]
}'),
('How to run a Team Teach course', 'How to run a Team Teach course Foundation Trainer Plus ANZ', '{
      "items": [
        {
          "name": "Team Teach Connect"
        },
        {
          "name": "Course Preperation"
        },
        {
          "name": "Materials"
        },
        {
          "name": "Utilising the Knowledge Hub"
        }
      ]
}');

INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
-- OPEN
    -- F2F
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

    -- VIRTUAL
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

    --MIXED
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

--INDIRECT
    -- F2F
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),


    -- VIRTUAL
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),


    --MIXED
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

--CLOSED
    -- F2F
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

    -- VIRTUAL
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

    --MIXED
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Theory Foundation Trainer Plus ANZ', 1, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Communication Foundation Trainer Plus ANZ', 2, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Physical Warm Up Foundation Trainer Plus ANZ', 3, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Elevated Risks Foundation Trainer Plus ANZ', 4, true, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Prompts and Guides Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Supporting Small Children Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Seperations Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Presentations Foundation Trainer Plus ANZ', 9, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'How to run a Team Teach course Foundation Trainer Plus ANZ', 10, false, false, 'ANZ');