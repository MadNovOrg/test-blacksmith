INSERT INTO public.course (id, description, name, course_type, course_delivery_type, course_level, organization_id, reaccreditation, go1_integration, course_status, grading_confirmed, accredited_by) VALUES
(10032, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Bild Certified Course: PSTI', 'INDIRECT', 'F2F', 'BILD_REGULAR', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false, 'SCHEDULED', false, 'BILD');

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('b414536d-29dd-4902-81f9-e808503428ee', 10032, 'LEADER', 'ACCEPTED'),
('62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 10032, 'ASSISTANT', 'ACCEPTED');


INSERT INTO public.venue (id, name, city, address_line_one, address_line_two, post_code, geo_coordinates) VALUES
('575c1707-cec7-495d-99ed-2eea9fe30aae', 'Hampton High', 'Hanworth Road', 'Hampton', 'Middlesex', 'TW12 3HB', '(51.429675, -0.373938)'::point);

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '2 month', date(now()) + time '17:00' + interval '2 month', 10032, '575c1707-cec7-495d-99ed-2eea9fe30aae');

SELECT setval('course_id_seq', 10032);
