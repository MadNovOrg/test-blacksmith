Update bild_strategy
Set modules = '{
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
          "name": "Cross over"
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
      "name": "Prompts and Guides",
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
          "name": "Separation"
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
Where id IN (SELECT id from bild_strategy WHERE name = 'NON_RESTRICTIVE_TERTIARY')