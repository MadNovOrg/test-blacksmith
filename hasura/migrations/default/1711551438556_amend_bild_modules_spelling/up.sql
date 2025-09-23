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
            "name": "Policies, practices & procedures"
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
            "name": "Small Child and One Person Holds",
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
