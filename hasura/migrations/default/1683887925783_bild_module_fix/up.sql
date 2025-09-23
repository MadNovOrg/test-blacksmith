UPDATE "public"."bild_strategy"
  SET modules = '{
    "groups": [
      {
        "name": "",
        "duration": 180,
        "modules": [
          { "name": "Sheild" },
          { "name": "Sitting cradle sheild" },
          { "name": "Sheild to FGR" },
          { "name": "Front Ground recovery" }
        ]
      }
    ],
    "modules": [
      { "name": "Single Elbow to FGR", "duration":30 },
      { "name": "Front Ground recovery", "duration":120 },
      { "name": "Back ground recovery", "duration": 180 },
      { "name": "Hip Chair Emergency response", "duration": 45 },
      { "name": "Dead weight to standing", "duration": 15 },
      { "name": "Ground fights", "duration": 30 },
      { "name": "Ground assaults", "duration": 30 },
      { "name": "Response to everyday objects used as weapons", "duration": 360 }
    ]
  }'::jsonb
  WHERE name = 'RESTRICTIVE_TERTIARY_ADVANCED'
