INSERT INTO public.course_invites (id, email, status, course_id) VALUES
  ('d1d9a569-6f96-42ee-ac83-1ecb3f849999', 'user1@teamteach.testinator.com', 'ACCEPTED', 10011),
  ('d1d9a569-6f96-42ee-ac84-1ecb3f849999', 'user2@teamteach.testinator.com', 'ACCEPTED', 10011),
  ('d1d9a569-6f96-42ee-ac85-1ecb3f849999', 'user1.with.org@teamteach.testinator.com', 'ACCEPTED', 10011),
  ('d1d9a569-6f96-42ee-ac86-1ecb3f849999', 'user2.with.org@teamteach.testinator.com', 'ACCEPTED', 10011);

INSERT INTO public.course_participant (registration_id, course_id, profile_id, invoice_id, invite_id, attended, grading_feedback, grade, date_graded, hs_consent) VALUES
  ('edb0661b-bede-4a09-9066-339b7a0fe001', 10011,  '6b72504a-6447-4b30-9909-e8e6fc1d300f', '26e05f96-b687-4348-b6d8-1c863a849000', 'd1d9a569-6f96-42ee-ac83-1ecb3f849999', true, '', 'PASS', NOW(), true),
  ('edb0661b-bede-4a09-9066-339b7a0fe002', 10011,  'd394a9ff-7517-4e35-91aa-466f9d4c1b77', '26e05f96-b687-4348-b6d8-1c863a849001', 'd1d9a569-6f96-42ee-ac84-1ecb3f849999', true, '', 'PASS', NOW(), true),
  ('edb0661b-bede-4a09-9066-339b7a0fe003', 10011,  'fb523ef0-7fd1-42b2-b078-dce29a1713fe', '26e05f96-b687-4348-b6d8-1c863a849002', 'd1d9a569-6f96-42ee-ac85-1ecb3f849999', true, '', 'OBSERVE_ONLY', NOW(), true),
  ('edb0661b-bede-4a09-9066-339b7a0fe004', 10011,  'a39bb4b3-a07a-4610-8da1-b0ce885cc263', '26e05f96-b687-4348-b6d8-1c863a849003', 'd1d9a569-6f96-42ee-ac86-1ecb3f849999', true, 'Failed.', 'FAIL', NOW(), true);

INSERT INTO public.course_module (module_id, course_id)
SELECT module.id as module_id, 10011 as course_id
FROM public.module module
JOIN public.module_group gr ON module.module_group_id = gr.id
WHERE module.course_level = 'LEVEL_1' AND gr.mandatory = TRUE;

INSERT INTO public.course_participant_module (course_participant_id, module_id, completed)
SELECT participant.id as course_participant_id, module.id as module_id, TRUE as completed
FROM public.course_participant participant
JOIN public.course course ON participant.course_id = course.id
JOIN public.course_module cmodule ON cmodule.course_id = course.id
JOIN public.module module ON cmodule.module_id = module.id
WHERE course.id = 10011;

INSERT INTO public.course_certificate (course_id, profile_id, number, expiry_date, course_name, course_level, certification_date, is_revoked)
SELECT 10011 as course_id, participant.profile_id as profile_id, 'OP-L1-10011' as number,
       NOW() + interval '36 months' as expiry_date, course.name as course_name, course.course_level as course_level,
       NOW() as certification_date, false as is_revoked
FROM public.course_participant participant
JOIN public.course course ON participant.course_id = course.id
WHERE participant.course_id = 10011 AND participant.grade != 'FAIL';

UPDATE course_participant SET certificate_id = certificate.id
FROM public.course_certificate certificate
WHERE certificate.course_id = 10011 AND course_participant.profile_id = certificate.profile_id;
