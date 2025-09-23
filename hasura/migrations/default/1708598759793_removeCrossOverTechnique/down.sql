INSERT INTO module(name,course_level,module_category,module_group_id) VALUES
('Cross over','LEVEL_1','THEORY',(SELECT id FROM module_group WHERE name = 'Personal Safety' AND course_level = 'LEVEL_1')),
('Cross over','LEVEL_2','THEORY',(SELECT id FROM module_group WHERE name = 'Personal Safety' AND course_level = 'LEVEL_2')),
('Cross over','INTERMEDIATE_TRAINER','THEORY',(SELECT id FROM module_group WHERE name = 'Personal Safety' AND course_level = 'INTERMEDIATE_TRAINER')),
('Cross over','ADVANCED_TRAINER','THEORY',(SELECT id FROM module_group WHERE name = 'Personal Safety' AND course_level = 'ADVANCED_TRAINER'));

UPDATE module_v2
SET lessons = '{
  "items": [
    {
      "name": "Arm responses"
    },
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
        "name": "Cross over"
    },
    {
      "name": "Body Disengagements"
    }
  ]
}'

WHERE name = 'Personal Safety';

UPDATE bild_strategy
SET modules = '{
  "groups": [
    {
      "name": "Arm responses",
      "modules": [
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
            "name": "Cross over"
        },
        {
          "name": "Arm responses"
        },
        {
          "name": "Body Disengagements"
        }
      ],
      "duration": 30
    },
    {
      "name": "Neck Disengagement Module",
      "modules": [
        {
          "name": "Steering wheel"
        },
        {
          "name": "Fix & stabilise"
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
          "name": "Bar & brace - behind"
        },
        {
          "name": "Elbow guide out of headlock"
        }
      ],
      "duration": 30
    },
    {
      "name": "Prompts and Guids",
      "modules": [
        {
          "name": "Show and go"
        },
        {
          "name": "Caring C guide"
        },
        {
          "name": "Turn gather guide"
        },
        {
          "name": "Steering away"
        },
        {
          "name": "Arm waltz"
        },
        {
          "name": "Seperation"
        },
        {
          "name": "Punches & kicks"
        },
        {
          "name": "Half shield"
        },
        {
          "name": "Turn gather guide"
        }
      ],
      "duration": 20
    },
    {
      "name": "Clothing Responses",
      "modules": [
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
          "name": "From behind"
        }
      ],
      "duration": 20
    },
    {
      "name": "Hair Responses",
      "modules": [
        {
          "name": "One handed grab"
        },
        {
          "name": "Two handed grab"
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
      ],
      "duration": 20
    },
    {
      "name": "Bite Responses",
      "modules": [
        {
          "name": "Eye bulge"
        },
        {
          "name": "Distraction"
        },
        {
          "name": "Jaw manual manipulation"
        }
      ],
      "duration": 20
    }
  ]
}'
WHERE name = 'NON_RESTRICTIVE_TERTIARY';