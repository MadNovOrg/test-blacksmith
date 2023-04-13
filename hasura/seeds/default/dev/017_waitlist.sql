INSERT INTO public.course (id, name, course_type, course_delivery_type, course_level, reaccreditation, go1_integration, course_status, grading_confirmed, min_participants, max_participants, accredited_by) VALUES
(10013, 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', false, false, 'CONFIRM_MODULES', false, 5, 10, 'ICM');

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', 10013, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10013, 'LEADER', 'ACCEPTED');

INSERT INTO public.course_participant (course_id, profile_id) VALUES
(10013, 'ab528bc4-0d66-417f-8a34-eed6b949ea27'),
(10013, '1054214f-1f5b-4d94-a381-ab6fba404f41'),
(10013, '5a7f3010-cd40-454a-88d9-c93935c039ec'),
(10013, '6896b053-0d36-45b4-889c-9472d846c4a1'),
(10013, 'fbe6eb48-ad58-40f9-9388-07e743240ce3'),
(10013, 'd1b97054-357e-4a53-9a43-4acf8353a465'),
(10013, 'bdc08f2a-6a23-4a53-9587-65f32d16c41e'),
(10013, 'fdedead5-1218-4332-8199-8b2bdce414a7'),
(10013, '11935252-570f-42ef-a141-5cdf8f78270d'),
(10013, '41e9fa1d-0712-43cd-8571-bbf219ab016b');

INSERT INTO public.waitlist (course_id, given_name, family_name, email, phone, org_name) VALUES
(10013, 'Peter', 'Snyder', 'peter.snyder@example.com', '+44 1632 960255', 'Example org'),
(10013, 'Stacey', 'Humphrey', 'stacey.humphrey@example.com', '+44 1632 960255', 'Example org 2');
