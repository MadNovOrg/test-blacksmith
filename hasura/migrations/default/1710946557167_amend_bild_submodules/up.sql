update module_v2
set "lessons" = '{}'::jsonb
where "name" = 'Refresh of Intermediate Techniques';

update bild_strategy
set "modules" = '{
    "modules": [
        {
            "name": "Values exercise"
        },
        {
            "name": "Legal framework"
        },
        {
            "name": "Policies, practices & procedure"
        },
        {
            "name": "Recording and reporting"
        },
        {
            "name": "6 core strategies"
        },
        {
            "name": "Circles of danger"
        },
        {
            "name": "Personal space and body language"
        },
        {
            "name": "Feeling associated with social space, personal space and intimate space"
        },
        {
            "name": "Calm stance"
        },
        {
            "name": "Calming scripts"
        },
        {
            "name": "Mission statement"
        },
        {
            "name": "Rights and responsibilities"
        },
        {
            "name": "Handling plans"
        },
        {
            "name": "Scripts"
        },
        {
            "name": "Post incident learning and support"
        },
        {
            "name": "Quiz"
        }
    ]
}'::jsonb
where "name" = 'PRIMARY';

update bild_strategy
set "modules" = '{
    "groups": [
        {
            "name": "Elevated Risks",
            "modules": [
                {
                    "name": "Seclusion"
                },
                {
                    "name": "Rapid tranquillisation"
                },
                {
                    "name": "Chemical restraint"
                },
                {
                    "name": "Mechanical restraint"
                },
                {
                    "name": "Clinical holding"
                },
                {
                    "name": "Physical restraint"
                },
                {
                    "name": "Psychological restraint"
                }
            ]
        }
    ],
    "modules": [
        {
            "name": "Six stages of Crisis"
        },
        {
            "name": "Conflict spiral"
        },
        {
            "name": "Fizzy pop challenge"
        },
        {
            "name": "Behaviours that challenge"
        },
        {
            "name": "De-escalation scenario"
        }
    ]
}'::jsonb
where "name" = 'SECONDARY';

update module_v2
set "lessons" = '{
    "items": [
        {
            "name": "Pulse raisers"
        },
        {
            "name": "Stretches"
        },
        {
            "name": "Row boat and ride bike"
        },
        {
            "name": "Pass ball"
        },
        {
            "name": "Sensitivity of fingers"
        }
    ]
}'::jsonb
where "name" = 'Physical Warm Up';

update module_v2
set "lessons" = '{
    "items": [
        {
            "name": "Punches and kicks"
        },
        {
            "name": "Half shield"
        },
        {
            "name": "Turn, gather, guide"
        }
    ]
}'::jsonb
where "name" = 'Separations';

update module_v2
set lessons = '{
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
            "name": "Body disengagements"
        }
    ]
}'::jsonb
where "name" = 'Personal Safety';

update bild_strategy
set "modules" = '{
    "groups": [
        {
            "name": "Arm responses",
            "modules": [
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
                    "name": "Body disengagements"
                }
            ],
            "duration": 30
        },
        {
            "name": "Neck Disengagement",
            "modules": [
                {
                    "name": "Steering wheel"
                },
                {
                    "name": "Fix and stabilise"
                },
                {
                    "name": "Windmill"
                },
                {
                    "name": "Snake"
                },
                {
                    "name": "Elbow swing"
                },
                {
                    "name": "Bar and brace - behind"
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
                    "name": "Turn, gather, guide"
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
                    "name": "Punches and kicks"
                },
                {
                    "name": "Half shield"
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
}'::jsonb
where "name" = 'NON_RESTRICTIVE_TERTIARY';

update bild_strategy
set "modules" = '{
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
                    "name": "Double elbow",
                    "duration": 15
                },
                {
                    "name": "Response to spitting",
                    "duration": 15
                },
                {
                    "name": "Response to dead weight",
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
            "name": "Seated Holds",
            "modules": [
                {
                    "name": "Standing graded holds to seats",
                    "duration": 30,
                    "mandatory": true
                },
                {
                    "name": "Small person holds to seats/beanbag",
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
                    "duration": 15
                }
            ]
        }
    ]
}'::jsonb
where "name" = 'RESTRICTIVE_TERTIARY_INTERMEDIATE';

update bild_strategy
set "modules" = '{
    "modules": [
        {
            "name": "Rights and responsibilities"
        },
        {
            "name": "Shield"
        },
        {
            "name": "Sitting cradle shield"
        },
        {
            "name": "Shield to front ground recovery"
        },
        {
            "name": "Front ground recovery"
        },
        {
            "name": "Back ground recovery"
        },
        {
            "name": "Single elbow to front ground recovery"
        },
        {
            "name": "Hip chair emergency response"
        },
        {
            "name": "Dead weight to standing"
        },
        {
            "name": "Ground fights"
        },
        {
            "name": "Ground assaults"
        },
        {
            "name": "Response to everyday objects used as weapons"
        }
    ]
}'::jsonb
where "name" = 'RESTRICTIVE_TERTIARY_ADVANCED';
