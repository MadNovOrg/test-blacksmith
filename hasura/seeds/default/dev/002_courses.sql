INSERT INTO public.course (id, booking_contact_profile_id, source, description, name, course_type, course_delivery_type, course_level, organization_id, reaccreditation, go1_integration, course_status, grading_confirmed, accredited_by, free_course_materials) VALUES
(10000, null, null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false, 'TRAINER_PENDING', false, 'ICM', null),
(10001, null, null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false, 'TRAINER_MISSING', false, 'ICM', null),
(10002, null, null, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Advanced Modules', 'OPEN', 'F2F', 'ADVANCED', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false, 'CANCELLED', false, 'ICM', null),
(10003, null, null, 'Some description.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', null, false, false, 'DECLINED', false, 'ICM', null),
(10004, null, null, 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', null, false, false, 'GRADE_MISSING', false, 'ICM', null),
(10005, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Very long description of the course.', 'Positive Behaviour Training: Advanced Modules', 'CLOSED', 'F2F', 'ADVANCED', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'DRAFT', false, 'ICM', 0),
(10006, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Some description.', 'Positive Behaviour Training: Level One', 'CLOSED', 'F2F', 'LEVEL_1', null, false, true, 'EVALUATION_MISSING', true, 'ICM', 0),
(10007, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'CLOSED', 'F2F', 'LEVEL_2', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, true, 'EVALUATION_MISSING', false, 'ICM', 0),
(10008, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Very long description of the course.', 'Positive Behaviour Training: Advanced Modules', 'CLOSED', 'F2F', 'ADVANCED', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'CONFIRM_MODULES', false, 'ICM', 0),
(10009, null, null, 'Some description.', 'Positive Behaviour Training: Level One', 'INDIRECT', 'VIRTUAL', 'LEVEL_1', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'CONFIRM_MODULES', false, 'ICM', null),
(10010, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Empty course for trainer certificates', 'Positive Behaviour Trainer: Advanced Trainer', 'CLOSED', 'F2F', 'ADVANCED_TRAINER', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'SCHEDULED', false, 'ICM', 0),
(10011, null, null, 'Course completed in the past', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'COMPLETED', true, 'ICM', null),
(10081, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Closed course level one virtual', 'Positive Behaviour Training: Level One', 'CLOSED', 'VIRTUAL', 'LEVEL_1', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'TRAINER_PENDING', true, 'ICM', 0),
(10082, null, null, 'Indirect course level two', 'Positive Behaviour Training: Level Two', 'INDIRECT', 'F2F', 'LEVEL_2', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'SCHEDULED', true, 'ICM', null),
(10083, null, null, 'Trainer missing course.', 'Positive Behaviour Training: Intermediate Trainer', 'OPEN', 'F2F', 'INTERMEDIATE_TRAINER', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false, 'TRAINER_MISSING', false, 'ICM', null),
(10084, null, null, 'cancelled course.', 'Positive Behaviour Training: Level One', 'OPEN', 'VIRTUAL', 'LEVEL_1', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, false, 'CANCELLED', false, 'ICM', null),
(10150, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Closed course level one virtual', 'Positive Behaviour Training: Level One', 'CLOSED', 'VIRTUAL', 'LEVEL_1', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'SCHEDULED', true, 'ICM', 0),
(10151, '6987feba-0877-4a2a-b7da-982de1977eb3', 'EXISTING_CLIENT', 'Closed course level one virtual', 'Positive Behaviour Training: Level Two', 'CLOSED', 'F2F', 'LEVEL_2', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, false, 'SCHEDULED', true, 'ICM', 0);
SELECT setval('course_id_seq', 10012);

INSERT INTO public.course_trainer (profile_id, course_id, type, status) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10000, 'LEADER', 'PENDING'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10001, 'LEADER', 'DECLINED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10004, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10006, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10007, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10008, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10010, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10011, 'LEADER', 'ACCEPTED'),
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 10150, 'LEADER', 'ACCEPTED'),
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 10151, 'LEADER', 'ACCEPTED'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10081, 'LEADER', 'PENDING'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 10082, 'LEADER', 'ACCEPTED');


INSERT INTO public.venue (id, name, city, address_line_one, address_line_two, post_code, geo_coordinates, country_code) VALUES
('bd4e4af5-8822-485c-bf48-16fe0d50729b', 'Birchwood Academy', 'New York', '10 Whitehart Lane', 'Kings Street', 'NY 10014', '(40.730610, -73.935242)'::point, 'GB-ENG'),
('2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b', 'Queen Elizabeth II Centre', 'New York', '10 Whitehart Lane', 'Kings Street', 'NY 10014', '(40.730610, -73.935242)'::point, 'GB-ENG'),
('d7d8d368-6241-4fb2-94f3-f18b65f57a20', 'Ireland Vinayaka Temple', 'Dublin', 'Sylvan Drive', '', 'IR3LL', '(53.3067965,-6.3683589)'::point, 'IE'),
('edf4913a-e33e-4508-894a-10e5174cd277', 'Sydney Town Hall', 'Sydney', '483 George St', '', '2000', '(-33.8731575,151.2061157)'::point, 'AU'),
('0026b9e2-bed3-451b-9adc-3ae7e8fe431e', 'Team Hutchinson Ford', 'Wellington', '186 Tuam Street', '', '8011', '(-43.5356591,172.6378499)'::point, 'NZ');

INSERT INTO public.course_schedule (start, "end", course_id, venue_id) VALUES
(date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', 10000, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now()) + time '09:00' + interval '1 month', date(now()) + time '17:00' + interval '1 month', 10001, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now() + interval '1 day') + time '09:00' + interval '1 month', date(now() + interval '1 day') + time '17:00' + interval '1 month', 10002, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now() + interval '2 days') + time '09:00' + interval '1 month', date(now() + interval '2 days') + time '17:00' + interval '1 month', 10003, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() - interval '1 day') + time '09:00', date(now() - interval '1 day') + time '17:00', 10004, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() - interval '3 day') + time '09:00', date(now() - interval '2 day') + time '17:00', 10010, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() + interval '4 days') + time '09:00' + interval '1 month', date(now() + interval '4 days') + time '17:00' + interval '1 month', 10005, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() - interval '4 days') + time '09:00', date(now() - interval '4 days') + time '17:00', 10006, null),
(date(now() - interval '2 days') + time '09:00', date(now() - interval '2 days') + time '17:00', 10007, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() + interval '8 days') + time '09:00' + interval '1 month', date(now() + interval '8 days') + time '17:00' + interval '1 month', 10008, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() + interval '9 days') + time '09:00' + interval '1 month', date(now() + interval '9 days') + time '17:00' + interval '1 month', 10009, null),
(date(now() - interval '1 month') + time '09:00', date(now() - interval '1 month') + time '17:00', 10011, 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
(date(now() + interval '10 days') + time '09:00' + interval '1 month', date(now() + interval  '10 days') + time '17:00' + interval '1 month', 10081, null),
(date(now() + interval '8 days') + time '09:00' + interval '1 month', date(now() + interval '8 days') + time '17:00' + interval '1 month', 10082, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() + interval '2 days') + time '09:00' + interval '1 month', date(now() + interval '2 days') + time '17:00' + interval '1 month', 10083, '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
(date(now() - interval '1 month') + time '09:00', date(now() - interval '1 month') + time '17:00', 10084, 'bd4e4af5-8822-485c-bf48-16fe0d50729b');
