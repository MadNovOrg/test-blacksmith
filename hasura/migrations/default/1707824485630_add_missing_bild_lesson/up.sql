update bild_strategy
set modules = '{
  "groups": [
    {
      "name": "Arm responses",
      "duration": 30,
      "modules": [
        { "name": "Side step in" },
        { "name": "Drop elbow" },
        { "name": "Pump" },
        { "name": "Conductor" },
        { "name": "Clock" },
        { "name": "Arm responses" },
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
      "name": "Prompts and Guids",
      "duration": 20,
      "modules": [
        { "name": "Show and go" },
        { "name": "Caring C guide" },
        { "name": "Turn gather guide" },
        { "name": "Steering away" },
        { "name": "Arm waltz" },
        { "name": "Seperation" },
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
where name = 'NON_RESTRICTIVE_TERTIARY';

UPDATE course_bild_module
SET modules = jsonb_set(
                modules,
                '{NON_RESTRICTIVE_TERTIARY,groups}',
                (SELECT jsonb_agg(
                            CASE
                                WHEN group_item->>'name' = 'Arm responses' THEN
                                    jsonb_set(group_item, '{modules}', 
                                              COALESCE(group_item->'modules', '[]') || '{"name": "Clock"}', true)
                                ELSE
                                    group_item
                            END
                        )
                 FROM jsonb_array_elements(modules->'NON_RESTRICTIVE_TERTIARY'->'groups') AS group_item),
                true
             )
WHERE modules @> '{"NON_RESTRICTIVE_TERTIARY": {"groups": [{"name": "Arm responses"}]}}';