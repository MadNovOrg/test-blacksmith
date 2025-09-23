UPDATE "public"."bild_strategy"
  SET modules = '{
    "groups": [
      {
        "name": "Ground holds",
        "duration": 180,
        "modules": [
          { "name": "Shield" },
          { "name": "Sitting cradle shield" },
          { "name": "Shield to FGR" },
          { "name": "Front Ground recovery" }
        ]
      }
    ],
    "modules": [
      { "name": "Single Elbow to FGR", "duration":30 },
      { "name": "Back ground recovery", "duration": 120 },
      { "name": "Hip Chair Emergency response", "duration": 45 },
      { "name": "Dead weight to standing", "duration": 15 },
      { "name": "Ground fights", "duration": 30 },
      { "name": "Ground assaults", "duration": 30 },
      { "name": "Response to everyday objects used as weapons", "duration": 360 }
    ]
  }'::jsonb
  WHERE name = 'RESTRICTIVE_TERTIARY_ADVANCED';

UPDATE "public"."bild_strategy"
  SET modules = '{
  "groups": [
    {
      "name": "Small Child and One Person Holds Module",
      "modules": [
        { "name": "Moving in hold", "duration": 15 },
        { "name": "Sitting in hold", "duration": 15 },
        { "name": "Small person hold to chairs", "duration": 15, "mandatory": true },
        { "name": "Chairs/beanbags to hold", "duration": 15 },
        { "name": "Change of face in seated position", "duration": 15 },
        { "name": "Sitting to floor", "duration": 15 },
        { "name": "Help along side", "duration": 15 },
        { "name": "Response to dead weight", "duration": 15 },
        { "name": "Single person double elbow + support", "duration": 15 }
      ]
    },
    {
      "name": "Standing Graded Holds",
      "modules": [
        { "name": "Friendly", "duration": 30 },
        { "name": "Single elbow", "duration": 30 },
        { "name": "Figure of four", "duration": 30 },
        { "name": "Double elbow", "duration": 30 },
        { "name": "Response to spitting", "duration": 30 },
        { "name": "Response to dead weight", "duration": 30, "mandatory": true }
      ]
    },
    {
      "name": "Seated Holds Module",
      "modules": [
        { "name": "Standing Graded Holds to Seats", "duration": 30, "mandatory": true },
        { "name": "Small Person Holds to Seats / Bean Bag", "duration": 30, "mandatory": true },
        { "name": "Moving to seated position", "duration": 30 },
        { "name": "Foot wedge", "duration": 30 },
        { "name": "Support with legs", "duration": 30 },
        { "name": "Change of face in seats", "duration": 30 },
        { "name": "Alternative change of face in seated", "duration": 30 },
        { "name": "Small child escorts", "duration": 30 }
      ]
    }
  ]
  }'::jsonb
  WHERE name = 'RESTRICTIVE_TERTIARY_INTERMEDIATE';


UPDATE "public"."bild_strategy"
  SET modules = '{
  "modules": [
    {"name": "Values exercise"},
    {"name": "Legal framework"},
    {"name": "Policies Practices & procedure"},
    {"name": "Recording and Reporting"},
    {"name": "6 Core Strategies"},
    {"name": "Circles of danger"},
    {"name": "Personal space and body language"},
    {"name": "Feeling associated with Social Space, Personal Space & Intimate Space"},
    {"name": "Calm stance"},
    {"name": "Calming scripts"},
    {"name": "Mission Statement"},
    {"name": "Rights & Responsibilities"},
    {"name": "Handling plans"},
    {"name": "Scripts"},
    {"name": "Post Incident Learning and Support"},
    {"name": "Quiz"}
  ]
  }'::jsonb
  WHERE name = 'PRIMARY';

UPDATE "public"."bild_strategy"
  SET modules = '{
  "groups": [
    {
      "name": "Arm responses",
      "duration": 30,
      "modules": [
        { "name": "Side step in" },
        { "name": "Drop elbow" },
        { "name": "Pump" },
        { "name": "Conductor" },
        { "name": "Cross over" },
        { "name": "Body Disengagements" }
      ]
    },
    {
      "name": "Neck Disengagement Module",
      "duration": 30,
      "modules": [
        { "name": "Steering wheel" },
        { "name": "Fix & stabilise" },
        { "name": "Windmill" },
        { "name": "Snake" },
        { "name": "Elbow Swing" },
        { "name": "Neck Brace" },
        { "name": "Bar & brace - behind" },
        { "name": "Elbow guide out of headlock" }
      ]
    },
    {
      "name": "Prompts and Guides",
      "duration": 20,
      "modules": [
        { "name": "Show and go" },
        { "name": "Caring C guide" },
        { "name": "Turn gather guide" },
        { "name": "Steering away" },
        { "name": "Arm waltz" },
        { "name": "Separation" },
        { "name": "Punches & kicks" },
        { "name": "Half shield" },
        { "name": "Turn gather guide" }
      ]
    },
    {
      "name": "Clothing Responses",
      "duration": 20,
      "modules": [
        { "name": "Closed fist hold" },
        { "name": "Tube grip" },
        { "name": "Close to the neck" },
        { "name": "From behind" }
      ]
    },
    {
      "name": "Hair Responses",
      "duration": 20,
      "modules": [
        { "name": "One handed grab" },
        { "name": "Two handed grab" },
        { "name": "Oyster" },
        { "name": "Knuckle roll" },
        { "name": "Knuckle slide" }
      ]
    },
    {
      "name": "Bite Responses",
      "duration": 20,
      "modules": [
        { "name": "Bite responses" },
        { "name": "Eye bulge" },
        { "name": "Distraction" },
        { "name": "Jaw manual manipulation" }
      ]
    }
  ]
  }'::jsonb
  WHERE name = 'NON_RESTRICTIVE_TERTIARY';