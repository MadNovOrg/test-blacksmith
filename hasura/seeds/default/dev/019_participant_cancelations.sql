INSERT INTO public.course (id, name, course_type, course_delivery_type, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants, accredited_by) VALUES
(10027, 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', false, false, 'CONFIRM_MODULES', false, 5, 10, 'ICM');

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '2 month', date(now()) + time '17:00' + interval '2 month', 10027, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10027, 'LEADER', 'ACCEPTED');

INSERT INTO public.course_participant (course_id, profile_id) VALUES
(10027, 'ab528bc4-0d66-417f-8a34-eed6b949ea27');

INSERT INTO public.course_participant_audit(authorized_by, type, payload, course_id, profile_id) VALUES
('1054214f-1f5b-4d94-a381-ab6fba404f41', 'CANCELLATION', '{"cancellation_fee_percent": "100", "cancellation_reason": "Attendee self-cancelled his attendance."}'::jsonb, 10027, '1054214f-1f5b-4d94-a381-ab6fba404f41');
