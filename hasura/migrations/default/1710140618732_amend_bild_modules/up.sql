UPDATE bild_strategy
SET modules = '
{
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
                    "name": "Body Disengagements"
                },
                {
                    "name": "Arm responses"
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
                    "name": "Arm waltz"
                },
                {
                    "name": "Caring C guide"
                },
                {
                    "name": "Turn gather guide"
                },
                {
                    "name": "Half shield"
                },
                {
                    "name": "Punches & kicks"
                },
                {
                    "name": "Seperation"
                },
                {
                    "name": "Show and go"
                },
                {
                    "name": "Steering away"
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
}
'::jsonb
WHERE name = 'NON_RESTRICTIVE_TERTIARY';

UPDATE bild_strategy
SET modules = '
  {
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
                    "name": "Small Person Holds to Seats / Beanbag",
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
                }
            ]
        }
    ]
}
'::jsonb
WHERE name = 'RESTRICTIVE_TERTIARY_INTERMEDIATE';