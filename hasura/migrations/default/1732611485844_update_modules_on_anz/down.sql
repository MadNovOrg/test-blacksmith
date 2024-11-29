DELETE FROM module_setting WHERE shard = 'ANZ' AND (
    module_name LIKE '%Arm responses%' 
    OR module_name LIKE '%Clothing responses%'
    OR module_name LIKE '%Hair responses%'
    OR module_name LIKE '%Neck responses%'
    OR module_name LIKE '%Body Responses%'
    OR module_name LIKE '%Bite Responses%'
    OR module_name LIKE '%Responses to Punches & Kicks%'
);


DELETE FROM module_v2 where name LIKE '%ANZ%' AND (
    name LIKE '%Arm responses%'
    OR name LIKE '%Clothing responses%'
    OR name LIKE '%Hair responses%'
    OR name LIKE '%Neck responses%'
    OR name LIKE '%Body Responses%'
    OR name LIKE '%Bite Responses%'
    OR name LIKE '%Responses to Punches & Kicks%'
);

INSERT INTO module_v2("display_name", "name", "lessons") Values
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
 ('Personal Safety Modules - Assess Risk, Reduce Risk, Gates','Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ','{
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
('Personal Safety Modules - Assess Risk, Reduce Risk, Gates','Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ','{
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
}');

INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
-- LEVEL 1
            ('LEVEL_1', false, false, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_1', false, false, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One ANZ', 5, false, false, 'ANZ'),

-- LEVEL 1 BS
            (E'LEVEL_1_BS', false, false, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

            (E'LEVEL_1_BS', false, false, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', false, true, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, false, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),
            (E'LEVEL_1_BS', true, true, 'navy', 80, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level One BS ANZ', 5, false, false, 'ANZ'),

-- LEVEL 2
            ('LEVEL_2', false, false, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

            ('LEVEL_2', false, false, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 140, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Level Two ANZ', 5, false, false, 'ANZ'),

-- INDIRECT TRAINER
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Intermediate Trainer ANZ', 5, false, false, 'ANZ'),

-- FOUNDATION TRAINER PLUS
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Personal Safety Modules - Assess Risk, Reduce Risk, Gates Foundation Trainer Plus ANZ', 5, false, false, 'ANZ');


-- UPDATE FOUNDATION TRAINER PLUS and LEVEL 1 BS sort
UPDATE module_setting SET 
    sort = sort - 3
WHERE shard = 'ANZ' AND course_level IN ('FOUNDATION_TRAINER_PLUS', 'LEVEL_1_BS') AND sort >= 9;

-- UPDATE LEVEL 1, LEVEL 2 and INTERMEDIATE TRAINER sort
UPDATE module_setting SET 
    sort = sort - 6 
    WHERE shard = 'ANZ' AND course_level IN ('LEVEL_1', 'LEVEL_2', 'INTERMEDIATE_TRAINER') AND sort >= 12;

UPDATE module_setting SET duration = 180 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Theory Level Two ANZ';

UPDATE module_setting SET duration = 60 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Communication Level Two ANZ';

UPDATE module_setting SET duration = 20 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Prompts and Guides Level Two ANZ';

UPDATE module_setting SET duration = 40 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Seperations Level Two ANZ';

UPDATE module_setting SET duration = 60 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Small Child and One Person Holds Level Two ANZ';

UPDATE module_setting SET duration = 90 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Two Person Standing Holds Level Two ANZ';

UPDATE module_setting SET duration = 90 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Two Person Seated Holds Level Two ANZ';

UPDATE module_setting SET duration = 40 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Transport Level Two ANZ';

-- Remove new module items

UPDATE module_v2
SET lessons = jsonb_set(
    lessons,
    '{items}',
    (SELECT jsonb_agg(item)
     FROM jsonb_array_elements(lessons->'items') AS item
     WHERE item->>'name' != 'Effective and Less Effective Practice')
)
WHERE "name" IN (
  'Theory Level One NP ANZ',
  'Theory Level One BS ANZ', 
  'Theory Level One ANZ', 
  'Theory Level Two ANZ', 
  'Foundation Trainer Theory', 
  'Theory Intermediate Trainer ANZ', 
  'Theory Foundation Trainer Plus ANZ'
);

UPDATE module_v2
SET lessons = jsonb_set(
    lessons,
    '{items}',
    (SELECT jsonb_agg(item)
     FROM jsonb_array_elements(lessons->'items') AS item
     WHERE item->>'name' != 'Behaviours of Communication')
)
WHERE "name" IN (
  'Communication Level One NP ANZ',
  'Communication Level One BS ANZ',
  'Communication Level One ANZ',
  'Communication Level Two ANZ',
  'Foundation Trainer Communication',
  'Communication Intermediate Trainer ANZ',
  'Communication Foundation Trainer Plus ANZ'
);

