DELETE FROM course_module 
WHERE module_id IN (Select id from module where name = 'Cross over');

DELETE FROM course_participant_module 
WHERE module_id IN (Select id from module where name = 'Cross over');

DELETE FROM module
WHERE name = 'Cross over';

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