INSERT INTO public.course (id, description, name, course_type, course_delivery_type, course_level, organization_id, reaccreditation, go1_integration)
VALUES
    (10000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false),
    (10001, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false),
    (10002, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Advanced Modules', 'OPEN', 'F2F', 'ADVANCED', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false),
    (10003, 'Some description.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', null, false, false),
    (10004, 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', null, false, false),
    (10005, 'Very long description of the course.', 'Positive Behaviour Training: Advanced Modules', 'CLOSED', 'F2F', 'ADVANCED', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false),
    (10006, 'Some description.', 'Positive Behaviour Training: Level One', 'CLOSED', 'F2F', 'LEVEL_1', null, false, true),
    (10007, 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'CLOSED', 'F2F', 'LEVEL_2', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, true),
    (10008, 'Very long description of the course.', 'Positive Behaviour Training: Advanced Modules', 'CLOSED', 'F2F', 'ADVANCED', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, true),
    (10009, 'Some description.', 'Positive Behaviour Training: Level One', 'INDIRECT', 'VIRTUAL', 'LEVEL_1', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false);

SELECT setval('course_id_seq', 10010);

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10000, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10001, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10002, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10003, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10004, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10005, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10006, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10007, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10008, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10009, 'LEADER', 'ACCEPTED');

INSERT INTO public.venue (id, name, city, address_line_one, address_line_two, post_code, geo_coordinates) VALUES
('bd4e4af5-8822-485c-bf48-16fe0d50729b', 'Birchwood Academy', 'New York', '10 Whitehart Lane', 'Kings Street', 'NY 10014', '(40.730610, -73.935242)'::point),
('2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b', 'Queen Elizabeth II Centre', 'New York', '10 Whitehart Lane', 'Kings Street', 'NY 10014', '(40.730610, -73.935242)'::point);

INSERT INTO public.course_schedule (name, type, start, "end", course_id, venue_id) VALUES
('name', 'PHYSICAL', '2022-05-05T09:00:00+00:00', '2022-05-05T17:00:00+00:00', 10000, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
('name', 'PHYSICAL', '2022-05-08T09:00:00+00:00', '2022-05-09T16:00:00+00:00', 10001, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
('name', 'PHYSICAL', '2022-05-15T09:00:00+00:00', '2022-05-16T17:00:00+00:00', 10002, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
('name', 'PHYSICAL', '2022-05-15T09:00:00+00:00', '2022-05-15T17:00:00+00:00', 10003, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-05-16T09:00:00+00:00', '2022-05-17T17:00:00+00:00', 10004, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-05-05T09:00:00+00:00', '2022-05-06T17:00:00+00:00', 10005, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'ELEARNING', '2022-05-05T10:00:00+00:00', '2022-05-05T14:00:00+00:00', 10006, null),
('name', 'PHYSICAL', '2022-05-05T14:00:00+00:00', '2022-05-05T17:00:00+00:00', 10006, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-05-05T09:00:00+00:00', '2022-05-06T17:00:00+00:00', 10007, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-05-05T09:00:00+00:00', '2022-05-06T17:00:00+00:00', 10008, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'ELEARNING', '2022-05-05T09:00:00+00:00', '2022-05-06T17:00:00+00:00', 10009, null);
