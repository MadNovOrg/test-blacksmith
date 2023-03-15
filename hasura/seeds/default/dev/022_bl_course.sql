INSERT INTO public.course (id, name, course_type, course_delivery_type, organization_id, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants) VALUES
(10030, 'Positive Behaviour Training: Level One', 'INDIRECT', 'F2F', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'LEVEL_1', false, true, 'CONFIRM_MODULES', false, 5, 20);

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '2 month', date(now()) + time '17:00' + interval '2 month', 10030, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10030, 'LEADER', 'ACCEPTED');

INSERT INTO public.order (course_id, profile_id, quantity, payment_method, billing_address, billing_given_name, billing_family_name, billing_email, billing_phone, registrants, organization_id, "user") VALUES
(10030, '13a223a8-2184-42f1-ba37-b49e115e59a2', 0, 'INVOICE', 'Minerva Centre Thornthwaite close', 'Doe', 'John', 'seed.bl.booking@teamteach.testinator.com', '+441111111', '[]'::jsonb, 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', '{"firstName": "John", "lastName": "Trainer", "email": "trainer@teamteach.testinator.com"}'::jsonb);

SELECT setval('course_id_seq', 10030);
