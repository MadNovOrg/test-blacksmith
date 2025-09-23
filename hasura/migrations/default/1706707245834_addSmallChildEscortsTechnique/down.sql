DELETE FROM module
WHERE name = 'Small child escorts';

UPDATE bild_strategy
SET modules = '{
  "groups": [
    {
      "name": "Small Child and One Person Holds Module",
      "modules": [
        {
          "name": "Moving in hold",
          "duration": 15
        },
        {
          "name": "Sitting in hold",
          "duration": 15
        },
        {
          "name": "Small person hold to chairs",
          "duration": 15,
          "mandatory": true
        },
        {
          "name": "Chairs/beanbags to hold",
          "duration": 15
        },
        {
          "name": "Change of face in seated position",
          "duration": 15
        },
        {
          "name": "Sitting to floor",
          "duration": 15
        },
        {
          "name": "Help along side",
          "duration": 15
        },
        {
          "name": "Response to dead weight",
          "duration": 15
        },
        {
          "name": "Single person double elbow + support",
          "duration": 15
        }
      ]
    },
    {
      "name": "Standing Graded Holds",
      "modules": [
        {
          "name": "Friendly",
          "duration": 30
        },
        {
          "name": "Single elbow",
          "duration": 30
        },
        {
          "name": "Figure of four",
          "duration": 30
        },
        {
          "name": "Double elbow",
          "duration": 30
        },
        {
          "name": "Response to spitting",
          "duration": 30
        },
        {
          "name": "Response to dead weight",
          "duration": 30,
          "mandatory": true
        }
      ]
    },
    {
      "name": "Seated Holds Module",
      "modules": [
        {
          "name": "Standing Graded Holds to Seats",
          "duration": 30,
          "mandatory": true
        },
        {
          "name": "Small Person Holds to Seats / Bean Bag",
          "duration": 30,
          "mandatory": true
        },
        {
          "name": "Moving to seated position",
          "duration": 30
        },
        {
          "name": "Foot wedge",
          "duration": 30
        },
        {
          "name": "Support with legs",
          "duration": 30
        },
        {
          "name": "Change of face in seats",
          "duration": 30
        },
        {
          "name": "Alternative change of face in seated",
          "duration": 30
        },
        {
          "name": "Small child escorts",
          "duration": 30
        }
      ]
    }
  ]
}'::jsonb
WHERE id = (SELECT id FROM bild_strategy WHERE name = 'RESTRICTIVE_TERTIARY_INTERMEDIATE');

UPDATE module_v2
SET lessons = '{
  "items": [
    {
      "name": "Moving in hold"
    },
    {
      "name": "Sitting in hold"
    },
    {
      "name": "Chairs/beanbags to hold"
    },
    {
      "name": "Change of face in seated position"
    },
    {
      "name": "Sitting to floor"
    },
    {
      "name": "Help along side"
    },
    {
      "name": "Response to dead weight"
    },
    {
      "name": "Single person double elbow + support"
    },
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
      "name": "Help hug"
    }
  ]
}'::jsonb
WHERE name = 'Small Child and One Person Holds';
