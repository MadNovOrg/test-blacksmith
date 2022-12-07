INSERT INTO public.course (id, name, course_type, course_delivery_type, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants) VALUES
(10029, 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', false, false, 'CONFIRM_MODULES', false, 5, 10);

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '4 month', date(now()) + time '17:00' + interval '4 month', 10029, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');
                           
INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10029, 'LEADER', 'ACCEPTED');

INSERT INTO public.course_participant (course_id, profile_id) VALUES
(10029, 'ab528bc4-0d66-417f-8a34-eed6b949ea27'),
(10029, 'fb523ef0-7fd1-42b2-b078-dce29a1713fe');


INSERT INTO public.course_participant_audit(authorized_by, type, payload, course_id, profile_id) VALUES
('22015a3e-8907-4333-8811-85f782265a63', 'TRANSFER', '{"fromCourse": {"id": 10028, "courseCode": "OP-L1-10028"}, "toCourse": {"id": 10029, "courseCode": "OP-L1-10029"}, "type": "APPLY_TERMS", "percentage": "100"}'::jsonb, 10029, 'fb523ef0-7fd1-42b2-b078-dce29a1713fe');

SELECT setval('course_id_seq', 10029);