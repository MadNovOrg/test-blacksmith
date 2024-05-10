INSERT INTO "public"."module_v2"("lessons", "display_name", "name", "created_at", "updated_at") VALUES ('{"items":[{"name":"The Why"},{"name":"Values"},{"name":"Behaviours of communication"},{"name":"Law and guidance"},{"name":"Stages of distress and support"},{"name":"Conflict spiral and cycle of influence"},{"name":"Listening and learning"},{"name":"Quiz and evaluation"}]}', E'Theory', E'Level 1 BS Theory', E'2024-03-28T14:48:49.020976+00:00', E'2024-03-28T14:48:49.020976+00:00');

INSERT INTO "public"."module_v2"("lessons", "display_name", "name", "created_at", "updated_at") VALUES ('{"items":[{"name":"Circles of awareness and danger"},{"name":"Posturing, non-verbal and verbal communication"},{"name":"Calm stance"},{"name":"Calming scripts"}]}', E'Personal Space and Body Language', E'Level 1 BS Personal Space & Body Language', E'2024-03-28T14:51:59.697155+00:00', E'2024-03-28T14:51:59.697155+00:00');

INSERT INTO "public"."module_v2"("name", "display_name", "lessons", "created_at", "updated_at") VALUES (E'Level 1 BS Elevated Risk', E'Elevated Risk', '{"items":[{"name":"Positional asphyxia and hyper flexion"},{"name":"Pressure on abdomen and ribcage"},{"name":"Leaning forward"},{"name":"Prone restraint"}]}', E'2024-03-28T14:54:06.367508+00:00', E'2024-03-28T14:54:06.367508+00:00');

INSERT INTO "public"."module_v2"("name", "display_name", "lessons", "created_at", "updated_at") VALUES (E'Level 1 BS Physical Warm Up', E'Physical Warm Up', '{"items":[{"name":"Pulse raisers"},{"name":"Stretches"},{"name":"Rowboat and ride bike"},{"name":"Pass ball"},{"name":"Sensitivity of fingers"},{"name":"Circle of friends"}]}', E'2024-03-28T14:58:36.442156+00:00', E'2024-03-28T14:58:36.442156+00:00');

INSERT INTO "public"."module_v2"("lessons", "display_name", "name", "created_at", "updated_at") VALUES ('{"items":[{"name":"Show and go"},{"name":"Caring C guide"},{"name":"Steering away"},{"name":"Punches and kicks"}]}', E'Prompts, Guides and Separations', E'Level 1 BS Prompts, Guides & Separations', E'2024-03-28T15:03:10.357521+00:00', E'2024-03-28T15:03:10.357521+00:00');

INSERT INTO "public"."module_v2"("lessons", "display_name", "name", "created_at", "updated_at") VALUES ('{"items":[{"name":"Arm responses","items":[{"name":"Side step in"},{"name":"Drop elbow"},{"name":"Pump"},{"name":"Conductor"}]},{"name":"Neck responses","items":[{"name":"Fix and stabilise"},{"name":"Windmill"},{"name":"Snake"}]},{"name":"Clothing responses","items":[{"name":"Closed fist hold"},{"name":"Tube grip"},{"name":"Close to the neck"}]},{"name":"Hair responses","items":[{"name":"One handed grab"},{"name":"Oyster"},{"name":"Knuckle roll"},{"name":"Knuckle slide"}]}]}', E'Personal Safety - Assess Risk, Reduce Risk, Gates', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', E'2024-03-28T15:13:20.830597+00:00', E'2024-03-28T15:13:20.830597+00:00');

INSERT INTO "public"."module_setting"("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion") VALUES
(E'LEVEL_1_BS', false, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', false, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 3, true, false),

(E'LEVEL_1_BS', false, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', false, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 6, true, false),

(E'LEVEL_1_BS', false, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),

(E'LEVEL_1_BS', false, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', false, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 4, true, false),

(E'LEVEL_1_BS', false, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', false, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, true, false),

(E'LEVEL_1_BS', false, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', null, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false)
;
