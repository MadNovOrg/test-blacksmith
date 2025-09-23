INSERT INTO module_v2("display_name", "name", "lessons") VALUES 
('Theory', 'Theory Level One BS ANZ', '{
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
 ('Communication', 'Communication Level One BS ANZ', '{
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
 ('Physical Warm Up', 'Physical Warm Up Level One BS ANZ', '{
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
 ('Elevated Risks', 'Elevated Risks Level One BS ANZ', '{
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
 ('Personal Safety Modules - Assess Risk, Reduce Risk, Gates','Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ','{
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
('Prompts and Guides','Prompts and Guides Level One BS ANZ', '{
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
('Supporting Small Children','Supporting Small Children Level One BS ANZ','{
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
('Seperations', 'Seperations Level One BS ANZ', '{
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
}');

INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
-- OPEN
    -- F2F
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'F2F','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'F2F','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'F2F','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'F2F','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'F2F','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'F2F','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'F2F','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'F2F','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'F2F','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'F2F','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'F2F','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'F2F','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'F2F','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'F2F','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'F2F','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'F2F','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'F2F','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'F2F','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'F2F','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

    -- VIRTUAL
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'VIRTUAL','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'VIRTUAL','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'VIRTUAL','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'VIRTUAL','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'VIRTUAL','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'VIRTUAL','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'VIRTUAL','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

    --MIXED
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'MIXED','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'MIXED','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'MIXED','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'MIXED','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'MIXED','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'MIXED','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'MIXED','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'MIXED','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'MIXED','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'MIXED','OPEN', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'MIXED','OPEN', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'MIXED','OPEN', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'MIXED','OPEN', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','OPEN', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'MIXED','OPEN', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'MIXED','OPEN', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

--INDIRECT
    -- F2F
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'F2F','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'F2F','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'F2F','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'F2F','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'F2F','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'F2F','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'F2F','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'F2F','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'F2F','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),


    -- VIRTUAL
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'VIRTUAL','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),


    --MIXED
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'MIXED','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'MIXED','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'MIXED','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'MIXED','INDIRECT', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'MIXED','INDIRECT', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'MIXED','INDIRECT', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

--CLOSED
    -- F2F
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'F2F','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'F2F','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'F2F','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'F2F','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'F2F','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'F2F','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'F2F','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'F2F','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'F2F','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'F2F','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'F2F','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'F2F','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'F2F','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'F2F','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'F2F','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'F2F','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

    -- VIRTUAL
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'VIRTUAL','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'VIRTUAL','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

    --MIXED
            (E'LEVEL_1_BS', false, false, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'MIXED','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, false, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, true, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'MIXED','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, false, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'MIXED','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ'),

            (E'LEVEL_1_BS', true, true, 'navy', 180, 'MIXED','CLOSED', 'Theory Level One BS ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 60, 'MIXED','CLOSED', 'Communication Level One BS ANZ', 2, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'MIXED','CLOSED', 'Physical Warm Up Level One BS ANZ', 3, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 15, 'MIXED','CLOSED', 'Elevated Risks Level One BS ANZ', 4, true, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','CLOSED', 'Prompts and Guides Level One BS ANZ', 6, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'MIXED','CLOSED', 'Supporting Small Children Level One BS ANZ', 7, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 30, 'MIXED','CLOSED', 'Seperations Level One BS ANZ', 8, false, false, 'ANZ');