INSERT INTO module_v2("display_name", "name", "lessons") VALUES 
('Theory', 'Theory Level One ANZ', '{
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
 ('Communication', 'Communication Level One ANZ', '{
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
 ('Physical Warm Up', 'Physical Warm Up Level One ANZ', '{
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
 ('Elevated Risks', 'Elevated Risks Level One ANZ', '{
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
 ('Personal Safety Modules - Assess Risk, Reduce Risk, Gates','Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ','{
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
        },
        {
          "name": "Clock"
        },
        {
          "name": "Cross Step"
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
        },
        {
          "name": "From Behind"
        },
        {
          "name": "Two handed hold"
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
          "name": "One handed hold"
        },
        {
          "name": "Two handed hold"
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
      "name": "Neck responses",
      "items": [
        {
          "name": "Steering wheel"
        },
        {
          "name": "Fix and Stabilise"
        },
        {
          "name": "Windmill"
        },
        {
          "name": "Snake"
        },
        {
          "name": "Elbow Swing"
        },
        {
          "name": "Neck Brace"
        },
        {
          "name": "Bar & brace-behind"
        },
        {
          "name": "Elbow guide out of headlock"
        },
        {
          "name": "Spin out of strangle"
        }
      ]
    },
    {
      "name": "Body Responses",
      "items": [
        {
          "name": "Fix and Stabilise"
        },
        {
          "name": "Bar and gate"
        },
        {
          "name": "Sweep away"
        },
        {
          "name": "Hands Together and Entwined Fingers"
        },
        {
          "name": "Dynamic Release"
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
    },
    {
      "name": "Responses to Punches & Kicks",
      "items": [
        {
          "name": "X Support"
        }
      ]
    }
  ]
}'),
('Prompts and Guides','Prompts and Guides Level One ANZ', '{
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
('Seperations', 'Seperations Level One ANZ', '{
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
('Small Child and One Person Holds', 'Small Child and One Person Holds Level One ANZ', '{
      "items": [
        {
          "name": "Show and go"
        },
        {
          "name": "Caring C guide"
        },
        {
          "name": "Help hug"
        },
        {
          "name": "Single person double elbow with support"
        },
        {
          "name": "Moving in hold"
        },
        {
          "name": "Chairs/beanbags to hold"
        },
        {
          "name": "Change of face in seated position"
        },
        {
          "name": "Response to dead weight"
        },
        {
          "name": "Additional staff to support in bean bag"
        }
      ]
}');

INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
-- OPEN
    -- F2F
            ('LEVEL_1', false, false, 'navy', 180, 'F2F','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'F2F','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'F2F','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'F2F','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'F2F','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'F2F','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'F2F','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'F2F','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'F2F','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'F2F','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'F2F','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'F2F','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'F2F','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'F2F','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'F2F','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'F2F','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

    -- VIRTUAL
            ('LEVEL_1', false, false, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'VIRTUAL','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'VIRTUAL','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'VIRTUAL','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'VIRTUAL','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

    --MIXED
            ('LEVEL_1', false, false, 'navy', 180, 'MIXED','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'MIXED','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'MIXED','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'MIXED','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'MIXED','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'MIXED','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'MIXED','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'MIXED','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'MIXED','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'MIXED','OPEN', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'MIXED','OPEN', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'MIXED','OPEN', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

--INDIRECT
    -- F2F
            ('LEVEL_1', false, false, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'F2F','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'F2F','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'F2F','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'F2F','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),


    -- VIRTUAL
            ('LEVEL_1', false, false, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),


    --MIXED
            ('LEVEL_1', false, false, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'MIXED','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'MIXED','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'MIXED','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'MIXED','INDIRECT', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

--CLOSED
    -- F2F
            ('LEVEL_1', false, false, 'navy', 180, 'F2F','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'F2F','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'F2F','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'F2F','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'F2F','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'F2F','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'F2F','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'F2F','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'F2F','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'F2F','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'F2F','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'F2F','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

    -- VIRTUAL
            ('LEVEL_1', false, false, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'VIRTUAL','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'VIRTUAL','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'VIRTUAL','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'VIRTUAL','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

    --MIXED
            ('LEVEL_1', false, false, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 60, 'MIXED','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 60, 'MIXED','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 60, 'MIXED','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One ANZ', 1, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One ANZ', 2, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One ANZ', 3, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One ANZ', 4, true, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 60, 'MIXED','CLOSED', 'Small Child and One Person Holds Level One ANZ', 8, false, false, 'ANZ');