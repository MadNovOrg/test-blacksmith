INSERT INTO public.course (id, name, course_type, course_delivery_type, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants, accredited_by) VALUES
(10028, 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', false, false, 'CONFIRM_MODULES', false, 5, 10, 'ICM');

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '3 month', date(now()) + time '17:00' + interval '3 month', 10028, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10028, 'LEADER', 'ACCEPTED');

INSERT INTO public.course_participant (course_id, profile_id) VALUES
(10028, 'ab528bc4-0d66-417f-8a34-eed6b949ea27');

INSERT INTO public.course_invites (email, course_id) VALUES
  ('user1@teamteach.testinator.com', 10028);

INSERT INTO public.course_participant_audit(authorized_by, type, payload, course_id, profile_id) VALUES
('22015a3e-8907-4333-8811-85f782265a63', 'REPLACEMENT', '{"oldParticipant": {"avatar": null, "fullName": "Elijah Participant"}, "inviteeEmail": "user1@teamteach.testinator.com", "inviteeFirstName": "Oliver", "inviteeLastName": "Participant"}'::jsonb, 10028, 'd394a9ff-7517-4e35-91aa-466f9d4c1b77');
