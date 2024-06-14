
DELETE FROM "module_setting"
WHERE
    "course_type" = 'INDIRECT'
    AND "course_level" = 'LEVEL_1_BS';

INSERT INTO "public"."module_v2"("display_name", "name", "lessons", "created_at", "updated_at") VALUES
('Theory', 'Level 1 BS Indirect Theory', '{"items":[{"name":"The Why"},{"name":"Values"},{"name":"Behaviours of communication"},{"name":"Law and guidance"},{"name":"Stages of distress and support"},{"name":"Conflict spiral and cycle of influence"},{"name":"Listening and learning"},{"name":"Quiz and evaluation"}]}', '2024-03-28T14:48:49.020976+00:00', '2024-03-28T14:48:49.020976+00:00'),
('Personal Space and Body Language', 'Level 1 BS Indirect Personal Space & Body Language', '{"items":[{"name":"Circles of awareness and danger"},{"name":"Posturing, non-verbal and verbal communication"},{"name":"Calm stance"},{"name":"Calming scripts"}]}', '2024-03-28T14:51:59.697155+00:00', '2024-03-28T14:51:59.697155+00:00'),
('Elevated Risk', 'Level 1 BS Indirect Elevated Risk', '{"items":[{"name":"Positional asphyxia and hyper flexion"},{"name":"Pressure on abdomen and ribcage"},{"name":"Leaning forward"},{"name":"Prone restraint"}]}', '2024-03-28T14:54:06.367508+00:00', '2024-03-28T14:54:06.367508+00:00'),
('Physical Warm Up', 'Level 1 BS Indirect Physical Warm Up', '{"items":[{"name":"Pulse raisers"},{"name":"Stretches"},{"name":"Rowboat and ride bike"},{"name":"Pass ball"},{"name":"Sensitivity of fingers"},{"name":"Circle of friends"}]}', '2024-03-28T14:58:36.442156+00:00', '2024-03-28T14:58:36.442156+00:00'),
('Prompts, Guides and Separations', 'Level 1 BS Indirect Prompts, Guides & Separations', '{"items":[{"name":"Show and go"},{"name":"Caring C guide"},{"name":"Steering away"},{"name":"Punches and kicks"}]}', '2024-03-28T15:03:10.357521+00:00', '2024-03-28T15:03:10.357521+00:00'),
('Personal Safety - Assess Risk, Reduce Risk, Gates', 'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 
'{"items":[
{"name":"Arm responses","items":[{"name":"Side step in"},{"name":"Drop elbow"},{"name":"Pump"},{"name":"Conductor"}]},
{"name":"Clothing responses","items":[{"name":"Closed fist hold"},{"name":"Tube grip"},{"name":"Close to the neck"}]},
{"name":"Hair responses","items":[{"name":"One handed grab"},{"name":"Oyster"},{"name":"Knuckle roll"},{"name":"Knuckle slide"}]}, 
{"name":"Bite responses","items":[{"name":"Distraction"},{"name":"Assertive guide"},{"name":"Jaw manipulation"}]}
]}', '2024-03-28T15:13:20.830597+00:00', '2024-03-28T15:13:20.830597+00:00');
 
 
INSERT INTO "public"."module_setting"("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion") VALUES
(E'LEVEL_1_BS', false, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Elevated Risk', 3, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Personal Space & Body Language', 2, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Physical Warm Up', 4, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Prompts, Guides & Separations', 5, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Indirect Theory', 1, true, false);
