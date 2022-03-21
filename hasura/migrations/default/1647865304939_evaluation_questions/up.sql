TRUNCATE TABLE course_evaluation_questions CASCADE;

INSERT INTO "course_evaluation_questions" ("question", "display_order", "type", "group", "question_key", "required") VALUES
('Attitude and approach of trainers',	0,	'RATING',	'TRAINER_STANDARDS',	'ATTITUDE_AND_APPROACH_OF_TRAINERS',	'0'),
('Knowledge of subject',	1,	'RATING',	'TRAINER_STANDARDS',	'KNOWLEDGE_OF_SUBJECT',	'0'),
('Preparation and organisation',	2,	'RATING',	'TRAINER_STANDARDS',	'PREPARATION_AND_ORGANISATION',	'0'),
('Group participation',	3,	'RATING',	'TRAINER_STANDARDS',	'GROUP_PARTICIPATION',	'0'),
('Workbook and presentation materials',	0,	'RATING',	'MATERIALS_AND_VENUE',	'WORKBOOK_AND_PRESENTATION_MATERIALS',	'0'),
('Suitability of training environment',	1,	'RATING',	'MATERIALS_AND_VENUE',	'SUITABILITY_OF_TRAINING_ENVIRONMENT',	'0'),
('Lunch & refreshments',	0,	'RATING',	'MATERIALS_AND_VENUE',	'LUNCH_REFRESHMENTS',	'0'),
('SIGNATURE',	999,	NULL,	NULL,	'SIGNATURE',	'0'),
('Objectives achieved',	1,	'RATING',	'TRAINING_RATING',	'OBJECTIVES_ACHIEVED',	'0'),
('Emphasis on de-escalation/holistic response 1',	2,	'RATING',	'TRAINING_RATING',	'EMPHASIS_ON_DEESCALATION',	'0'),
('Risk reduction/safety as paramount concern',	3,	'RATING',	'TRAINING_RATING',	'RISK_REDUCTION',	'0'),
('Value of training',	0,	'RATING',	'TRAINING_RELEVANCE',	'VALUE_OF_TRAINING',	'0'),
('Pertinence to work role',	1,	'RATING',	'TRAINING_RELEVANCE',	'PERTINENCE_TO_WORK_ROLE',	'1'),
('Objectives clearly stated',	0,	'RATING',	'TRAINING_RATING',	'OBJECTIVES_CLEARLY_STATED',	'1'),
('Were there any issues arising from the course?',	1,	'TEXT',	NULL,	'ISSUES_ARISING_FROM_COURSE',	'1'),
('What would you describe as the key strengths of this course?',	2,	'TEXT',	NULL,	'KEY_STRENGTHS_OF_COURSE',	'0'),
('Were there any injuries?',	0,	'BOOLEAN_REASON_Y',	NULL,	'ANY_INJURIES',	'1'),
('What follow up or changes can you suggest to further develop our practice?',	3,	'TEXT',	NULL,	'SUGGESTIONS',	'1');
