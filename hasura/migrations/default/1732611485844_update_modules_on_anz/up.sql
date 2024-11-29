-- DELETE Personal Safety module settings
  DELETE FROM module_setting WHERE shard = 'ANZ' AND module_name LIKE '%Personal Safety Modules - Assess Risk, Reduce Risk, Gates%';

-- DELETE Personal Safety modules
  DELETE FROM module_v2 WHERE name LIKE '%Personal Safety Modules - Assess Risk, Reduce Risk, Gates%' AND name LIKE '%ANZ%';

-- UPDATE FOUNDATION TRAINER PLUS and LEVEL 1 BS sort
  UPDATE module_setting SET 
      sort = sort + 3 -- We delete personal safety that has sort = 5 and add 4 more (arm sort = 5, clothing sort = 6, hair sort = 7, bite sort = 8 and the one whose sort was 6 now is 9)
  WHERE shard = 'ANZ' AND course_level IN ('FOUNDATION_TRAINER_PLUS', 'LEVEL_1_BS') AND sort >= 5;

-- UPDATE LEVEL 1, LEVEL 2 and INTERMEDIATE TRAINER sort
  UPDATE module_setting SET 
      sort = sort + 6 -- We delete personal safety that has sort = 5 and add 4 more (arm sort = 5, clothing sort = 6, hair sort = 7, neck sort = 8, body sort = 9, bite sort = 10, punches sort = 11, and the one whose sort was 6 now is 12)
  WHERE shard = 'ANZ' AND course_level IN ('LEVEL_1', 'LEVEL_2', 'INTERMEDIATE_TRAINER') AND sort >= 5;

-- INSERT Personal Safety modules as standalone modules
  INSERT INTO module_v2("display_name", "name", "lessons") VALUES 
  -- LEVEL 1
      ('Arm responses', 'Arm responses Level One ANZ', '{"items": [
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
        ]}'),
      ('Clothing responses', 'Clothing responses Level One ANZ', '{"items": [
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
        ]}'),
      ('Hair responses', 'Hair responses Level One ANZ', '{"items": [
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
        ]}'),
      ('Neck responses', 'Neck responses Level One ANZ', '{"items": [
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
        ]}'),
      ('Body Responses','Body Responses Level One ANZ','{"items": [
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
      ]}'),
      ('Bite Responses','Bite Responses Level One ANZ','{"items": [
          {
            "name": "Distraction"
          },
          {
            "name": "Assertive Guide with Head Support"
          },
          {
            "name": "Jaw Release"
          }
      ]}'),
      ('Responses to Punches & Kicks','Responses to Punches & Kicks Level One ANZ','{"items": [
          {
            "name": "X Support"
          }
      ]}'),
  -- LEVEL 1 BS 
      ('Arm responses', 'Arm responses Level One BS ANZ', '{"items": [
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
          ]}'),
      ('Clothing responses', 'Clothing responses Level One BS ANZ', '{"items": [
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
          ]}'),
      ('Hair responses', 'Hair responses Level One BS ANZ', '{"items": [
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
          ]}'),
      ('Bite Responses', 'Bite Responses Level One BS ANZ', '{"items": [
              {
              "name": "Distraction"
              },
              {
              "name": "Assertive Guide with Head Support"
              },
              {
              "name": "Jaw Release"
              }
          ]}'),
  -- LEVEL 2
      ('Arm responses', 'Arm responses Level Two ANZ', '{"items": [
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
        ]}'),
      ('Clothing responses', 'Clothing responses Level Two ANZ', '{"items": [
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
        ]}'),
      ('Hair responses', 'Hair responses Level Two ANZ', '{"items": [
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
        ]}'),
      ('Neck responses', 'Neck responses Level Two ANZ', '{"items": [
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
        ]}'),
      ('Body Responses','Body Responses Level Two ANZ','{"items": [
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
          }]}'),
      ('Bite Responses','Bite Responses Level Two ANZ','{"items": [
          {
            "name": "Distraction"
          },
          {
            "name": "Assertive Guide with Head Support"
          },
          {
            "name": "Jaw Release"
          }]}'),
      ('Responses to Punches & Kicks','Responses to Punches & Kicks Level Two ANZ','{"items": [
          {
            "name": "X Support"
          }]}'),
  -- INTERMEDIATE TRAINER
      ('Arm responses', 'Arm responses Intermediate Trainer ANZ', '{"items": [
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
        ]}'),
      ('Clothing responses', 'Clothing responses Intermediate Trainer ANZ', '{"items": [
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
        ]}'),
      ('Hair responses', 'Hair responses Intermediate Trainer ANZ', '{"items": [
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
        ]}'),
      ('Neck responses', 'Neck responses Intermediate Trainer ANZ', '{"items": [
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
        ]}'),
      ('Body Responses','Body Responses Intermediate Trainer ANZ','{"items": [
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
          }]}'),
      ('Bite Responses','Bite Responses Intermediate Trainer ANZ','{"items": [
          {
            "name": "Distraction"
          },
          {
            "name": "Assertive Guide with Head Support"
          },
          {
            "name": "Jaw Release"
          }
      ]}'),
      ('Responses to Punches & Kicks','Responses to Punches & Kicks Intermediate Trainer ANZ','{"items": [
          {
            "name": "X Support"
          }]}'),
  -- FOUNDATION TRAINER PLUS
    ('Arm responses', 'Arm responses Foundation Trainer Plus ANZ', '{"items": [
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
        ]}'),
    ('Clothing responses', 'Clothing responses Foundation Trainer Plus ANZ', '{"items": [
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
        ]}'),
    ('Hair responses', 'Hair responses Foundation Trainer Plus ANZ', '{"items": [
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
        ]}'),
    ('Bite Responses', 'Bite Responses Foundation Trainer Plus ANZ', '{"items": [
        {
        "name": "Distraction"
        },
        {
        "name": "Assertive Guide with Head Support"
        },
        {
        "name": "Jaw Release"
        }
    ]}');

-- INSERT MODULE SETTINGS
  INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
  -- LEVEL 1
    -- OPEN
      -- F2F
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'F2F','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'F2F','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'F2F','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'F2F','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'F2F','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'F2F','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'F2F','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'F2F','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'MIXED','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'MIXED','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'MIXED','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','OPEN', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'MIXED','OPEN', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

    -- INDIRECT
      -- F2F
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'F2F','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'F2F','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'F2F','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'F2F','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

    -- CLOSED
      -- F2F
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'F2F','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'F2F','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'F2F','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'F2F','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, false, 'navy', 10, 'MIXED','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, false, 'navy', 10, 'MIXED','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', false, true, 'navy', 10, 'MIXED','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level One ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','CLOSED', 'Body Responses Level One ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_1', true, true, 'navy', 10, 'MIXED','CLOSED', 'Responses to Punches & Kicks Level One ANZ', 11, false, false, 'ANZ'),

  -- LEVEL 1 BS
    -- OPEN
      -- F2F
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
      -- VIRTUAL
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
        
      -- MIXED
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

    -- INDIRECT
      -- F2F
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
      -- VIRTUAL
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
        
      -- MIXED
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

    -- CLOSED
      -- F2F
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
      -- VIRTUAL
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
        
      -- MIXED
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, false, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, false, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', false, true, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),
            
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level One BS ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level One BS ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level One BS ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_1_BS', true, true, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level One BS ANZ', 8, false, false, 'ANZ'),

  -- LEVEL 2
    -- OPEN
      -- F2F
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'F2F','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'F2F','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'F2F','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'F2F','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'F2F','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5, 'F2F','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'F2F','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'F2F','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'F2F','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20,'F2F','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15,'F2F','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15,'F2F','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30,'F2F','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10,'F2F','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15,'F2F','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5, 'F2F','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'VIRTUAL','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'VIRTUAL','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'VIRTUAL','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'VIRTUAL','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'VIRTUAL','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'MIXED','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'MIXED','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'MIXED','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'MIXED','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'MIXED','OPEN', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','OPEN', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','OPEN', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'MIXED','OPEN', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'MIXED','OPEN', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','OPEN', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'MIXED','OPEN', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

    -- INDIRECT
      -- F2F
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'F2F','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'F2F','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'F2F','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'F2F','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'F2F','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'F2F','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'F2F','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'F2F','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'F2F','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'F2F','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'F2F','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'VIRTUAL','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'VIRTUAL','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'VIRTUAL','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'VIRTUAL','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'MIXED','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'MIXED','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'MIXED','INDIRECT', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'MIXED','INDIRECT', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'MIXED','INDIRECT', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','INDIRECT', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'MIXED','INDIRECT', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

    -- CLOSED
      -- F2F
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'F2F','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'F2F','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'F2F','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'F2F','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'F2F','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'F2F','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'F2F','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'F2F','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'F2F','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'F2F','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'F2F','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'F2F','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'F2F','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'VIRTUAL','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'VIRTUAL','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'VIRTUAL','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'VIRTUAL','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'VIRTUAL','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'VIRTUAL','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, false, 'navy', 10, 'MIXED','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, false, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 10, 'MIXED','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 15, 'MIXED','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, false, 'navy', 5,  'MIXED','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 20, 'MIXED','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', false, true, 'navy', 10, 'MIXED','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

            ('LEVEL_2', true, true, 'navy', 20, 'MIXED','CLOSED', 'Arm responses Level Two ANZ', 5, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','CLOSED', 'Clothing responses Level Two ANZ', 6, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','CLOSED', 'Hair responses Level Two ANZ', 7, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 30, 'MIXED','CLOSED', 'Neck responses Level Two ANZ', 8, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 10, 'MIXED','CLOSED', 'Body Responses Level Two ANZ', 9, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 15, 'MIXED','CLOSED', 'Bite Responses Level Two ANZ', 10, false, false, 'ANZ'),
            ('LEVEL_2', true, true, 'navy', 5,  'MIXED','CLOSED', 'Responses to Punches & Kicks Level Two ANZ', 11, false, false, 'ANZ'),

  -- INTERMEDIATE TRAINER
    -- OPEN
      -- F2F
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','OPEN', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

    -- INDIRECT
      -- F2F
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

    -- CLOSED
      -- F2F
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'F2F','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'F2F','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'F2F','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'F2F','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

      -- VIRTUAL
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

      -- MIXED
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, false, 'navy', 0, 'MIXED','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, false, 'navy', 0, 'MIXED','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', false, true, 'navy', 0, 'MIXED','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Intermediate Trainer ANZ', 5, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Intermediate Trainer ANZ', 6, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Intermediate Trainer ANZ', 7, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Neck responses Intermediate Trainer ANZ', 8, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Body Responses Intermediate Trainer ANZ', 9, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Intermediate Trainer ANZ', 10, false, false, 'ANZ'),
            ('INTERMEDIATE_TRAINER', true, true, 'navy', 0, 'MIXED','CLOSED', 'Responses to Punches & Kicks Intermediate Trainer ANZ', 11, false, false, 'ANZ'),

  -- FOUNDATION TRAINER PLUS
    -- OPEN
      -- F2F
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
      -- VIRTUAL
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
        
      -- MIXED
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','OPEN', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

    -- INDIRECT
      -- F2F
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
      -- VIRTUAL
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
        
      -- MIXED
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','INDIRECT', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

    -- CLOSED
      -- F2F
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'F2F','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
      -- VIRTUAL
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'VIRTUAL','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
        
      -- MIXED
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, false, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),

            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, false, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', false, true, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ'),
            
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Arm responses Foundation Trainer Plus ANZ', 5, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Clothing responses Foundation Trainer Plus ANZ', 6, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Hair responses Foundation Trainer Plus ANZ', 7, false, false, 'ANZ'),
            ('FOUNDATION_TRAINER_PLUS', true, true, 'navy', 0, 'MIXED','CLOSED', 'Bite Responses Foundation Trainer Plus ANZ', 8, false, false, 'ANZ');


-- UPDATE LEVEL 2 REACCREDITAION MODULE DURATION
UPDATE module_setting SET duration = 90 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Theory Level Two ANZ';

UPDATE module_setting SET duration = 45 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Communication Level Two ANZ';

UPDATE module_setting SET duration = 15 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Prompts and Guides Level Two ANZ';

UPDATE module_setting SET duration = 15 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Seperations Level Two ANZ';

UPDATE module_setting SET duration = 30 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Small Child and One Person Holds Level Two ANZ';

UPDATE module_setting SET duration = 45 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Two Person Standing Holds Level Two ANZ';

UPDATE module_setting SET duration = 45 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Two Person Seated Holds Level Two ANZ';

UPDATE module_setting SET duration = 30 WHERE reaccreditation = true AND shard = 'ANZ' AND module_name = 'Transport Level Two ANZ';

-- INSERT NEW MODULES
UPDATE module_v2
SET lessons = jsonb_insert(
  lessons,
  '{items,4}',
  '{"name": "Effective and Less Effective Practice"}'::jsonb
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
SET lessons = jsonb_insert(
  lessons,
  '{items,5}',
  '{"name": "Behaviours of Communication"}'::jsonb
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

