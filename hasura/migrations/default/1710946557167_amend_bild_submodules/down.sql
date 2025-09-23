update module_v2
set "lessons" = '{
    "items": [
        {
            "name": "A recap of Level One and Level Two techniques that have been taught"
        }
    ]
}'::jsonb
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
            "name": "Policies Practices & procedure"
        },
        {
            "name": "Recording and Reporting"
        },
        {
            "name": "6 Core Strategies"
        },
        {
            "name": "Circles of danger"
        },
        {
            "name": "Personal space and body language"
        },
        {
            "name": "Feeling associated with Social Space, Personal Space & Intimate Space"
        },
        {
            "name": "Calm stance"
        },
        {
            "name": "Calming scripts"
        },
        {
            "name": "Mission Statement"
        },
        {
            "name": "Rights & Responsibilities"
        },
        {
            "name": "Handling plans"
        },
        {
            "name": "Scripts"
        },
        {
            "name": "Post Incident Learning and Support"
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
            "name": "Elevated Risks Module",
            "modules": [
                {
                    "name": "Seclusion"
                },
                {
                    "name": "Rapid tranquilisation"
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
                    "name": "Psychological Restraint"
                }
            ]
        }
    ],
    "modules": [
        {
            "name": "Six stages of crisis"
        },
        {
            "name": "Conflict Spiral"
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
            "name": "Row boat & ride bike"
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
            "name": "Punches & kicks"
        },
        {
            "name": "Half shield"
        },
        {
            "name": "Turn gather guide"
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
            "name": "Body Disengagements"
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
    "groups": [
        {
            "name": "Ground holds",
            "modules": [
                {
                    "name": "Shield"
                },
                {
                    "name": "Sitting cradle shield"
                },
                {
                    "name": "Shield to FGR"
                },
                {
                    "name": "Front Ground recovery"
                }
            ],
            "duration": 180
        }
    ],
    "modules": [
        {
            "name": "Single Elbow to FGR",
            "duration": 30
        },
        {
            "name": "Back ground recovery",
            "duration": 120
        },
        {
            "name": "Hip Chair Emergency response",
            "duration": 45
        },
        {
            "name": "Dead weight to standing",
            "duration": 15
        },
        {
            "name": "Ground fights",
            "duration": 30
        },
        {
            "name": "Ground assaults",
            "duration": 30
        },
        {
            "name": "Response to everyday objects used as weapons",
            "duration": 360
        }
    ]
}'::jsonb
where "name" = 'RESTRICTIVE_TERTIARY_ADVANCED';
