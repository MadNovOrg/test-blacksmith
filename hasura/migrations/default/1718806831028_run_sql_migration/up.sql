DELETE FROM "public"."module_setting" WHERE "course_level" = 'LEVEL_1_BS' AND "course_type" = 'INDIRECT';
 
DELETE FROM "public"."module_v2" WHERE "name" ILIKE '%Level 1 BS Indirect%';

DELETE FROM "public"."module_setting" WHERE "course_level" = 'LEVEL_1_BS' AND "course_type" = 'CLOSED';
 
DELETE FROM "public"."module_v2" WHERE "name" ILIKE '%Level 1 BS%';


INSERT INTO "public"."module_v2"("display_name", "name", "lessons", "created_at", "updated_at") VALUES
('Theory', 'Level 1 BS Theory', '{"items":[{"name":"The Why"},{"name":"Values"},{"name":"Behaviours of communication"},{"name":"Law and guidance"},{"name":"Stages of distress and support"},{"name":"Conflict spiral and cycle of influence"},{"name":"Listening and learning"},{"name":"Quiz and evaluation"}]}', '2024-03-28T14:48:49.020976+00:00', '2024-03-28T14:48:49.020976+00:00'),
('Personal Space and Body Language', 'Level 1 BS Personal Space & Body Language', '{"items":[{"name":"Circles of awareness and danger"},{"name":"Posturing, non-verbal and verbal communication"},{"name":"Calm stance"},{"name":"Calming scripts"}]}', '2024-03-28T14:51:59.697155+00:00', '2024-03-28T14:51:59.697155+00:00'),
('Elevated Risk', 'Level 1 BS Elevated Risk', '{"items":[{"name":"Positional asphyxia and hyper flexion"},{"name":"Pressure on abdomen and ribcage"},{"name":"Leaning forward"},{"name":"Prone restraint"}]}', '2024-03-28T14:54:06.367508+00:00', '2024-03-28T14:54:06.367508+00:00'),
('Physical Warm Up', 'Level 1 BS Physical Warm Up', '{"items":[{"name":"Pulse raisers"},{"name":"Stretches"},{"name":"Rowboat and ride bike"},{"name":"Pass ball"},{"name":"Sensitivity of fingers"},{"name":"Circle of friends"}]}', '2024-03-28T14:58:36.442156+00:00', '2024-03-28T14:58:36.442156+00:00'),
('Prompts, Guides and Separations', 'Level 1 BS Prompts, Guides & Separations', '{"items":[{"name":"Show and go"},{"name":"Caring C guide"},{"name":"Steering away"},{"name":"Punches and kicks"}]}', '2024-03-28T15:03:10.357521+00:00', '2024-03-28T15:03:10.357521+00:00'),
('Personal Safety - Assess Risk, Reduce Risk, Gates', 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 
'{"items":[
{"name":"Arm responses","items":[{"name":"Side step in"},{"name":"Drop elbow"},{"name":"Pump"},{"name":"Conductor"}]},
{"name":"Clothing responses","items":[{"name":"Closed fist hold"},{"name":"Tube grip"},{"name":"Close to the neck"}]},
{"name":"Hair responses","items":[{"name":"One handed grab"},{"name":"Oyster"},{"name":"Knuckle roll"},{"name":"Knuckle slide"}]}, 
{"name":"Bite responses","items":[{"name":"Distraction"},{"name":"Assertive guide"},{"name":"Jaw manipulation"}]}
]}', '2024-03-28T15:13:20.830597+00:00', '2024-03-28T15:13:20.830597+00:00'),
('Small children supports', 'Level 1 BS Small children supports',
'{"items":[
{"name":"Show and go"},
{"name":"Caring C guide"},
{"name":"Help Hug"},
{"name":"Guide to beanbag"}
]}', '2024-03-28T15:03:10.357521+00:00', '2024-03-28T15:03:10.357521+00:00'),
('Separations', 'Level 1 BS Separations',
'{"items":[
{"name":"Turn Gather Guide"},
{"name":"Half shield"}
]}', '2024-03-28T15:03:10.357521+00:00', '2024-03-28T15:03:10.357521+00:00');
 
 
INSERT INTO "public"."module_setting"("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion") VALUES
(E'LEVEL_1_BS', false, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Elevated Risk', 4, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 70, E'F2F', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 70, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 45, E'F2F', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 45, E'MIXED', E'INDIRECT', E'Level 1 BS Personal Space & Body Language', 2, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'F2F', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'MIXED', E'INDIRECT', E'Level 1 BS Physical Warm Up', 3, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 145, E'F2F', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 145, E'MIXED', E'INDIRECT', E'Level 1 BS Theory', 1, true, false),

(E'LEVEL_1_BS', false, false, E'navy', 30, E'F2F', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 30, E'F2F', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 30, E'F2F', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 30, E'F2F', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 30, E'MIXED', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 30, E'MIXED', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 30, E'MIXED', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 30, E'MIXED', E'INDIRECT', E'Level 1 BS Small children supports', 6, false, false),

(E'LEVEL_1_BS', false, false, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'F2F', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'MIXED', E'INDIRECT', E'Level 1 BS Separations', 7, false, false);

-------------------- CLOSED ------------------

INSERT INTO "public"."module_setting"("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion") VALUES
(E'LEVEL_1_BS', false, false, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Elevated Risk', 4, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 70, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 70, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 70, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 70, E'F2F', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 70, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 70, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 70, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 70, E'MIXED', E'CLOSED', E'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates', 5, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 45, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 45, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 45, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 45, E'F2F', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 45, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 45, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 45, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 45, E'MIXED', E'CLOSED', E'Level 1 BS Personal Space & Body Language', 2, true, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'F2F', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 10, E'MIXED', E'CLOSED', E'Level 1 BS Physical Warm Up', 3, false, false),
 
 (E'LEVEL_1_BS',false, false, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Prompts, Guides & Separations', 5, false, false),
 
(E'LEVEL_1_BS', false, false, E'navy', 145, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 145, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 145, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 145, E'F2F', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, false, E'navy', 145, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, false, E'navy', 145, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', false, true, E'navy', 145, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),
(E'LEVEL_1_BS', true, true, E'navy', 145, E'MIXED', E'CLOSED', E'Level 1 BS Theory', 1, true, false),

(E'LEVEL_1_BS', false, false, E'navy', 30, E'F2F', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 30, E'F2F', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 30, E'F2F', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 30, E'F2F', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 30, E'MIXED', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 30, E'MIXED', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 30, E'MIXED', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 30, E'MIXED', E'CLOSED', E'Level 1 BS Small children supports', 6, false, false),

(E'LEVEL_1_BS', false, false, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'F2F', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', false, false, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, false, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', false, true, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Separations', 7, false, false),
(E'LEVEL_1_BS', true, true, E'navy', 20, E'MIXED', E'CLOSED', E'Level 1 BS Separations', 7, false, false);



----------------------- module dependencies ---------------------



INSERT INTO module_setting_dependency(module_setting_id, module_setting_dependency_id) VALUES 
    ---- Elevated Risk
(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

----- CLOSED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Elevated Risk'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 


-------- Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

----- CLOSED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Personal Safety - Assess Risk, Reduce Risk, Gates'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

-------- Level 1 BS Prompts, Guides & Separations

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

----- CLOSED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Prompts, Guides & Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 


-------- Level 1 BS Small children supports


(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

----- CLOSED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Small children supports'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 


--------- Level 1 BS Separations


(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'INDIRECT' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

----- CLOSED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'F2F'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 
--------- MIXED

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = false
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = false
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
), 

(
  (
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Separations'
  ),
(
    SELECT id FROM module_setting 
    WHERE course_type = 'CLOSED' 
    AND course_level = 'LEVEL_1_BS'
    AND go1_integration = true
    AND reaccreditation = true
    AND course_delivery_type = 'MIXED'
    AND module_name = 'Level 1 BS Physical Warm Up'
  )
);