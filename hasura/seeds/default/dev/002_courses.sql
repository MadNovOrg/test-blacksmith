INSERT INTO public.course (id, description, name, course_type, course_delivery_type, course_level, organization_id, reaccreditation, trainer_profile_id)
VALUES ('45045398-f757-4ece-85c0-bdf2d95d7cee', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'), 
    ('913777a7-07fd-46d6-8ad8-d7498f630aea', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'),
    ('bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Positive Behaviour Training: Advanced Modules', 'OPEN', 'F2F', 'ADVANCED', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'),
    ('f1fd057b-547d-470b-aad8-b946a9eb8adc', 'Some description.', 'Positive Behaviour Training: Level One', 'OPEN', 'F2F', 'LEVEL_1', null, false, '13a223a8-2184-42f1-ba37-b49e115e59a2'), 
    ('c6c576cb-e3bf-482a-8b50-df0f5e0afc55', 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'OPEN', 'F2F', 'LEVEL_2', null, false, '13a223a8-2184-42f1-ba37-b49e115e59a2'),
    ('32e3324a-d27e-4c05-952d-5bb4e6e61e19', 'Very long description of the course.', 'Positive Behaviour Training: Advanced Modules', 'CLOSED', 'F2F', 'ADVANCED', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'),
    ('f37ef3b0-d705-4ade-99bb-5879dd218dbd', 'Some description.', 'Positive Behaviour Training: Level One', 'CLOSED', 'BLENDED', 'LEVEL_1', null, false, '13a223a8-2184-42f1-ba37-b49e115e59a2'), 
    ('7ea83d8f-9eaa-46e1-9e2b-49170ddb1666', 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'CLOSED', 'BLENDED', 'LEVEL_2', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'),
    ('eba38da7-aa4d-4aed-a269-2db6d93f09fc', 'Very long description of the course.', 'Positive Behaviour Training: Advanced Modules', 'CLOSED', 'BLENDED', 'ADVANCED', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'),
    ('6770c5e1-f21b-45e9-a1f4-084b079937ec', 'Some description.', 'Positive Behaviour Training: Level One', 'INDIRECT', 'VIRTUAL', 'LEVEL_1', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0', false, '13a223a8-2184-42f1-ba37-b49e115e59a2'), 
    ('64abf3d3-b7ab-4d8e-b625-bf921ecf5ebc', 'Very long description of the course.', 'Positive Behaviour Training: Level Two', 'OPEN', 'VIRTUAL', 'LEVEL_2', null, false, '13a223a8-2184-42f1-ba37-b49e115e59a2');

INSERT INTO public.course_leader (profile_id, course_id, type)
SELECT profile.id, '45045398-f757-4ece-85c0-bdf2d95d7cee', 'LEADER'
FROM public.profile profile
         JOIN public.organization_member organization_member ON profile.id = organization_member.profile_id
WHERE organization_member.organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d';
INSERT INTO public.course_leader (profile_id, course_id, type)
SELECT profile.id, '913777a7-07fd-46d6-8ad8-d7498f630aea', 'LEADER'
FROM public.profile profile
         JOIN public.organization_member organization_member ON profile.id = organization_member.profile_id
WHERE organization_member.organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d';
INSERT INTO public.course_leader (profile_id, course_id, type)
SELECT profile.id, 'bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6', 'LEADER'
FROM public.profile profile
         JOIN public.organization_member organization_member ON profile.id = organization_member.profile_id
WHERE organization_member.organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d';

INSERT INTO public.course_leader (profile_id, course_id, type) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'f1fd057b-547d-470b-aad8-b946a9eb8adc', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'c6c576cb-e3bf-482a-8b50-df0f5e0afc55', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', '32e3324a-d27e-4c05-952d-5bb4e6e61e19', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'f37ef3b0-d705-4ade-99bb-5879dd218dbd', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', '7ea83d8f-9eaa-46e1-9e2b-49170ddb1666', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'eba38da7-aa4d-4aed-a269-2db6d93f09fc', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', '6770c5e1-f21b-45e9-a1f4-084b079937ec', 'LEADER'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', '64abf3d3-b7ab-4d8e-b625-bf921ecf5ebc', 'LEADER');

INSERT INTO public.venue (id, name, city, address_line_one, address_line_two, post_code, geo_coordinates) VALUES
('bd4e4af5-8822-485c-bf48-16fe0d50729b', 'Birchwood Academy', 'New York', '10 Whitehart Lane', 'Kings Street', 'NY 10014', '(40.730610, -73.935242)'::point),
('2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b', 'Queen Elizabeth II Centre', 'New York', '10 Whitehart Lane', 'Kings Street', 'NY 10014', '(40.730610, -73.935242)'::point);

INSERT INTO public.course_schedule (name, type, start, "end", course_id, venue_id) VALUES
('name', 'PHYSICAL', '2022-04-05T09:00:00+00:00', '2022-04-05T17:00:00+00:00', '45045398-f757-4ece-85c0-bdf2d95d7cee', 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
('name', 'PHYSICAL', '2022-04-08T09:00:00+00:00', '2022-04-09T16:00:00+00:00', '913777a7-07fd-46d6-8ad8-d7498f630aea', 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
('name', 'PHYSICAL', '2022-04-15T09:00:00+00:00', '2022-04-16T17:00:00+00:00', 'bd42bbfb-9b7d-4028-ba50-6f8bbb6884d6', 'bd4e4af5-8822-485c-bf48-16fe0d50729b'),
('name', 'PHYSICAL', '2022-04-15T09:00:00+00:00', '2022-04-15T17:00:00+00:00', 'f1fd057b-547d-470b-aad8-b946a9eb8adc', '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-04-16T09:00:00+00:00', '2022-04-17T17:00:00+00:00', 'c6c576cb-e3bf-482a-8b50-df0f5e0afc55', '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-04-05T09:00:00+00:00', '2022-04-06T17:00:00+00:00', '32e3324a-d27e-4c05-952d-5bb4e6e61e19', '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'ELEARNING', '2022-04-05T10:00:00+00:00', '2022-04-05T14:00:00+00:00', 'f37ef3b0-d705-4ade-99bb-5879dd218dbd', null),
('name', 'PHYSICAL', '2022-04-05T14:00:00+00:00', '2022-04-05T17:00:00+00:00', 'f37ef3b0-d705-4ade-99bb-5879dd218dbd', '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-04-05T09:00:00+00:00', '2022-04-06T17:00:00+00:00', '7ea83d8f-9eaa-46e1-9e2b-49170ddb1666', '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'PHYSICAL', '2022-04-05T09:00:00+00:00', '2022-04-06T17:00:00+00:00', 'eba38da7-aa4d-4aed-a269-2db6d93f09fc', '2fa3a402-3aa0-4d7a-bbf9-e3dda59cd18b'),
('name', 'ELEARNING', '2022-04-05T09:00:00+00:00', '2022-04-06T17:00:00+00:00', '6770c5e1-f21b-45e9-a1f4-084b079937ec', null),
('name', 'ELEARNING', '2022-04-06T09:00:00+00:00', '2022-04-07T17:00:00+00:00', '64abf3d3-b7ab-4d8e-b625-bf921ecf5ebc', null);
