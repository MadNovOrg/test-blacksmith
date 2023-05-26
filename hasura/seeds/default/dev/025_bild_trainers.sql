INSERT INTO profile (id, _given_name, _family_name, _email) VALUES
('5bc30260-04fb-41a4-bd29-07c5f433d904', 'Bild', 'Intermediate', 'bild.intermediate@teamteach.testinator.com'),
('9b236919-918d-45ad-84e4-fb063c1938f0', 'Bild 2', 'Intermediate', 'bild.intermediate2@teamteach.testinator.com'),
('082d778c-7b78-4cd8-ac24-ec78c0e8b4ed', 'Bild 3', 'Intermediate', 'bild.intermediate3@teamteach.testinator.com'),

('1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'Bild', 'Advanced', 'bild.advanced@teamteach.testinator.com'),
('00d14fc3-7fa6-4d52-9ae4-f3bcb26baade', 'Bild 2', 'Advanced', 'bild.advanced2@teamteach.testinator.com'),
('98920ae3-ab16-424f-a0cd-302136c7b413', 'Bild 3', 'Advanced', 'bild.advanced3@teamteach.testinator.com'),

('2be41d95-40ee-49d5-810c-fae16135cccc', 'Bild', 'Senior', 'bild.senior@teamteach.testinator.com'),
('d1c5fa19-30da-4512-88f6-dc9ef6a26958', 'Bild 2', 'Senior', 'bild.senior2@teamteach.testinator.com'),
('4c6194ad-6dd3-461e-b4da-d3562b1007d1', 'Bild 3', 'Senior', 'bild.senior3@teamteach.testinator.com'),

('2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'Bild', 'Certified', 'bild.certified@teamteach.testinator.com'),
('c15a4b34-bb98-4096-ae2e-ea280fb14e05', 'Bild 2', 'Certified', 'bild.certified2@teamteach.testinator.com'),
('729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', 'Bild 3', 'Certified', 'bild.certified3@teamteach.testinator.com');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('f877d001-d2ff-49d5-99c9-5be70d8cea6f', '5bc30260-04fb-41a4-bd29-07c5f433d904', 'cognito'), -- bild.intermediate@teamteach.testinator.com
('e8824958-7460-4a1c-8db8-edd18dfb033b', '5bc30260-04fb-41a4-bd29-07c5f433d904', 'cognito'), -- bild.intermediate@teamteach.testinator.com staging

('a445bce8-51da-422b-8d16-c982d24b8d51', '9b236919-918d-45ad-84e4-fb063c1938f0', 'cognito'), -- bild.intermediate@teamteach2.testinator.com
('75108f6a-323b-45b5-8931-69dea73de765', '9b236919-918d-45ad-84e4-fb063c1938f0', 'cognito'), -- bild.intermediate@teamteach2.testinator.com staging

('6d49af95-15f3-41ff-a5bf-f65c620403df', '082d778c-7b78-4cd8-ac24-ec78c0e8b4ed', 'cognito'), -- bild.intermediate@teamteach3.testinator.com
('63c1cf87-ad6d-4c1c-a383-f0a1d668a9cf', '082d778c-7b78-4cd8-ac24-ec78c0e8b4ed', 'cognito'), -- bild.intermediate@teamteach3.testinator.com staging

('7b5baeb7-d365-4918-9d5d-32e3e97e20ac', '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'cognito'), -- bild.advanced@teamteach.testinator.com
('9740a79d-3d64-4d8f-b8fa-58525780e845', '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'cognito'), -- bild.advanced@teamteach.testinator.com staging

('adc694db-47df-4c58-b981-d3ca5e791c40', '00d14fc3-7fa6-4d52-9ae4-f3bcb26baade', 'cognito'), -- bild.advanced2@teamteach.testinator.com
('202e837e-e445-4815-9941-696076cd3494', '00d14fc3-7fa6-4d52-9ae4-f3bcb26baade', 'cognito'), -- bild.advanced2@teamteach.testinator.com staging

('8a8d36ec-bf9b-45a2-9e67-2a9de147bb28', '98920ae3-ab16-424f-a0cd-302136c7b413', 'cognito'), -- bild.advanced3@teamteach.testinator.com
('1db6f807-3092-4df3-a4f6-257d74e84a99', '98920ae3-ab16-424f-a0cd-302136c7b413', 'cognito'), -- bild.advanced3@teamteach.testinator.com staging

('e1e2b168-b75c-4e0c-b085-f1425d0b0951', '2be41d95-40ee-49d5-810c-fae16135cccc', 'cognito'), -- bild.senior@teamteach.testinator.com
('e0ac8629-257b-41c7-b5cd-228593cef804', '2be41d95-40ee-49d5-810c-fae16135cccc', 'cognito'), -- bild.senior@teamteach.testinator.com staging

('d1c5fa19-30da-4512-88f6-dc9ef6a26958', 'd1c5fa19-30da-4512-88f6-dc9ef6a26958', 'cognito'), -- bild.senior2@teamteach.testinator.com
('4ec4353c-c326-4d70-892c-20836f58e7f7', 'd1c5fa19-30da-4512-88f6-dc9ef6a26958', 'cognito'), -- bild.senior2@teamteach.testinator.com staging

('5c9646c8-4811-4c52-b263-e77ff8cdaf19', '4c6194ad-6dd3-461e-b4da-d3562b1007d1', 'cognito'), -- bild.senior3@teamteach.testinator.com
('383351e0-d4e3-4b73-b2dd-33d5caf4f4e7', '4c6194ad-6dd3-461e-b4da-d3562b1007d1', 'cognito'), -- bild.senior3@teamteach.testinator.com staging

('6029d762-9b72-4129-9bcd-0c2b41abe102', '2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'cognito'), -- bild.certified@teamteach.testinator.com
('8f21d99e-68f1-408b-b1c3-836d55ecb61b', '2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'cognito'), -- bild.certified@teamteach.testinator.com staging

('04daf570-80b2-4845-bed0-85f21654be3e', 'c15a4b34-bb98-4096-ae2e-ea280fb14e05', 'cognito'), -- bild.certified2@teamteach.testinator.com
('d9908d00-7cfb-47f1-9e6d-dadce5035bd2', 'c15a4b34-bb98-4096-ae2e-ea280fb14e05', 'cognito'), -- bild.certified2@teamteach.testinator.com staging

('5c4760c8-ba58-4a60-93a1-4e5ac5edba8d', '729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', 'cognito'), -- bild.certified3@teamteach.testinator.com
('7e6c471b-def5-4bed-97c8-b569ab0fb747', '729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', 'cognito'); -- bild.certified3@teamteach.testinator.com staging


INSERT INTO profile_role (profile_id, role_id) VALUES
('5bc30260-04fb-41a4-bd29-07c5f433d904', (SELECT id from role WHERE name = 'trainer')), -- bild.intermediate@teamteach.testinator.com
('9b236919-918d-45ad-84e4-fb063c1938f0', (SELECT id from role WHERE name = 'trainer')), -- bild.intermediate2@teamteach.testinator.com
('082d778c-7b78-4cd8-ac24-ec78c0e8b4ed', (SELECT id from role WHERE name = 'trainer')), -- bild.intermediate3@teamteach.testinator.com
('1b37b4d3-0dcc-4f17-96d5-bc27c029010f', (SELECT id from role WHERE name = 'trainer')), -- bild.advanced@teamteach.testinator.com
('00d14fc3-7fa6-4d52-9ae4-f3bcb26baade', (SELECT id from role WHERE name = 'trainer')), -- bild.advanced2@teamteach.testinator.com
('98920ae3-ab16-424f-a0cd-302136c7b413', (SELECT id from role WHERE name = 'trainer')), -- bild.advanced3@teamteach.testinator.com
('2be41d95-40ee-49d5-810c-fae16135cccc', (SELECT id from role WHERE name = 'trainer')), -- bild.senior@teamteach.testinator.com
('d1c5fa19-30da-4512-88f6-dc9ef6a26958', (SELECT id from role WHERE name = 'trainer')), -- bild.senior2@teamteach.testinator.com
('4c6194ad-6dd3-461e-b4da-d3562b1007d1', (SELECT id from role WHERE name = 'trainer')), -- bild.senior3@teamteach.testinator.com
('2c4b16db-bfba-4a21-a092-55ef9010ca2f', (SELECT id from role WHERE name = 'trainer')), -- bild.certified@teamteach.testinator.com
('c15a4b34-bb98-4096-ae2e-ea280fb14e05', (SELECT id from role WHERE name = 'trainer')), -- bild.certified@teamteach.testinator.com
('729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', (SELECT id from role WHERE name = 'trainer')); -- bild.certified@teamteach.testinator.com

INSERT INTO public.profile_trainer_role_type (profile_id, trainer_role_type_id) VALUES
('2be41d95-40ee-49d5-810c-fae16135cccc', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-senior')),
('2be41d95-40ee-49d5-810c-fae16135cccc', (SELECT id FROM public.trainer_role_type WHERE name = 'principal')),
('d1c5fa19-30da-4512-88f6-dc9ef6a26958', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-senior')),
('d1c5fa19-30da-4512-88f6-dc9ef6a26958', (SELECT id FROM public.trainer_role_type WHERE name = 'senior')),
('4c6194ad-6dd3-461e-b4da-d3562b1007d1', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-senior')),
('4c6194ad-6dd3-461e-b4da-d3562b1007d1', (SELECT id FROM public.trainer_role_type WHERE name = 'trainer-eta')),
('2c4b16db-bfba-4a21-a092-55ef9010ca2f', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-certified')),
('c15a4b34-bb98-4096-ae2e-ea280fb14e05', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-certified')),
('729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-certified')),
('5bc30260-04fb-41a4-bd29-07c5f433d904', (SELECT id FROM public.trainer_role_type WHERE name = 'senior-assist'));

INSERT INTO public.course_invites (id, email, status, course_id) VALUES
('2b70862b-9ef7-412f-b742-d9a159c46151', 'bild.intermediate@teamteach.testinator.com', 'ACCEPTED', 10033),
('cd154b82-8cbb-49d4-9806-a8115678c42e', 'bild.intermediate2@teamteach.testinator.com', 'ACCEPTED', 10033),
('5bbdb9d1-7777-478c-8405-d517331100bc', 'bild.intermediate3@teamteach.testinator.com', 'ACCEPTED', 10033),
('bc01e1c9-c4e5-4d87-8364-86d8d5e48461', 'bild.advanced@teamteach.testinator.com', 'ACCEPTED', 10034),
('05097f9a-1540-458c-ba35-738f90a78136', 'bild.advanced2@teamteach.testinator.com', 'ACCEPTED', 10034),
('ab232b6b-3ef0-4f87-b1e5-b2f1217f2abd', 'bild.advanced3@teamteach.testinator.com', 'ACCEPTED', 10034),
('21da4813-83e8-4be6-bd54-fa2a956239ef', 'bild.senior@teamteach.testinator.com', 'ACCEPTED', 10034),
('20d0d6dc-6eea-4c98-a086-5bf078a96c69', 'bild.senior2@teamteach.testinator.com', 'ACCEPTED', 10034),
('6377aae9-b835-47be-bacb-9b770a371237', 'bild.senior3@teamteach.testinator.com', 'ACCEPTED', 10034),
('e5e72cab-5c8f-474a-a867-3fffd210582e', 'bild.certified@teamteach.testinator.com', 'ACCEPTED', 10033),
('a8c4542a-2d7c-4e26-ba66-cd372f462248', 'bild.certified2@teamteach.testinator.com', 'ACCEPTED', 10033),
('95b96976-c985-40d9-91fc-bdf10a7e3089', 'bild.certified3@teamteach.testinator.com', 'ACCEPTED', 10033);

INSERT INTO public.course_participant (id, course_id, profile_id, invite_id) VALUES
('0af7536e-b396-490a-b7e8-eb4c5152c84e', 10033, '5bc30260-04fb-41a4-bd29-07c5f433d904', '2b70862b-9ef7-412f-b742-d9a159c46151'),
('adbde73d-d666-45c4-9e0c-afab87641e8e', 10033, '9b236919-918d-45ad-84e4-fb063c1938f0', 'cd154b82-8cbb-49d4-9806-a8115678c42e'),
('a06f96d1-2bc0-44d1-8895-4a106b44da60', 10033, '082d778c-7b78-4cd8-ac24-ec78c0e8b4ed', '5bbdb9d1-7777-478c-8405-d517331100bc'),
('0ec89029-dadd-420e-8f9d-956f005fa549', 10034, '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'bc01e1c9-c4e5-4d87-8364-86d8d5e48461'),
('2dcd0b8c-b194-4df3-9021-07d64543ea81', 10034, '00d14fc3-7fa6-4d52-9ae4-f3bcb26baade', '05097f9a-1540-458c-ba35-738f90a78136'),
('aadb93fa-c88c-422f-9cf4-b37c772a084d', 10034, '98920ae3-ab16-424f-a0cd-302136c7b413', 'ab232b6b-3ef0-4f87-b1e5-b2f1217f2abd'),
('d53455ed-1dbd-466f-8d41-37ce4a23124d', 10034, '2be41d95-40ee-49d5-810c-fae16135cccc', '21da4813-83e8-4be6-bd54-fa2a956239ef'),
('8562902e-f35d-4e6c-ac54-6fd5c17efdbd', 10034, 'd1c5fa19-30da-4512-88f6-dc9ef6a26958', '20d0d6dc-6eea-4c98-a086-5bf078a96c69'),
('a8458a98-f100-41cc-9959-6446e2729f57', 10034, '4c6194ad-6dd3-461e-b4da-d3562b1007d1', '6377aae9-b835-47be-bacb-9b770a371237'),
('d389dd72-72bc-46e4-b47a-aa7d4725e4de', 10034, '2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'e5e72cab-5c8f-474a-a867-3fffd210582e'),
('f75fcb66-5f3e-442b-93cd-a08aeb801f26', 10034, 'c15a4b34-bb98-4096-ae2e-ea280fb14e05', 'a8c4542a-2d7c-4e26-ba66-cd372f462248'),
('5c7942e4-b333-4913-ac7f-7571fde2c9c2', 10034, '729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', '95b96976-c985-40d9-91fc-bdf10a7e3089');

INSERT INTO public.course_certificate (id, course_id, number, expiry_date, profile_id, course_name, course_level, certification_date, is_revoked) VALUES
('0413cb5f-c04d-403c-b76f-23025c91de25', 10033, 'B.BILD-INT.F.CL.PSTI.10033', '2025-05-05', '5bc30260-04fb-41a4-bd29-07c5f433d904', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false),
('cdce5101-331a-449b-95f2-73f5863caf34', 10033, 'B.BILD-INT.F.CL.PSTI.10033', '2025-05-05', '9b236919-918d-45ad-84e4-fb063c1938f0', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false),
('fa53e9c5-63c2-41fd-85fa-8529a7794fb2', 10033, 'B.BILD-INT.F.CL.PSTI.10033', '2025-05-05', '082d778c-7b78-4cd8-ac24-ec78c0e8b4ed', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false),
('1a98205a-e742-49d5-a852-0a148d74bb16', 10034, 'B.BILD-ADV.F.OP.A.10034', '2025-05-05', '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'BILD Certified Course: A', 'BILD_ADVANCED_TRAINER', '2022-03-03', false),
('da8ef2ec-a7b4-41ad-8008-b74448cc7bac', 10034, 'B.BILD-ADV.F.OP.A.10034', '2025-05-05', '00d14fc3-7fa6-4d52-9ae4-f3bcb26baade', 'BILD Certified Course: A', 'BILD_ADVANCED_TRAINER', '2022-03-03', false),
('a5adb1b9-3bc8-45e3-ae29-7372b47310f1', 10034, 'B.BILD-ADV.F.OP.A.10034', '2025-05-05', '98920ae3-ab16-424f-a0cd-302136c7b413', 'BILD Certified Course: A', 'BILD_ADVANCED_TRAINER', '2022-03-03', false),
('9bd03085-6448-4870-8da3-7ec1eea5fe9f', 10034, 'B.BILD-ADV.F.OP.A.10034', '2025-05-05', 'd1c5fa19-30da-4512-88f6-dc9ef6a26958', 'BILD Certified Course: A', 'BILD_ADVANCED_TRAINER', '2022-03-03', false),
('970ff9d0-5a99-4eb1-b021-d815ab8a938a', 10034, 'B.BILD-ADV.F.OP.A.10034', '2025-05-05', '4c6194ad-6dd3-461e-b4da-d3562b1007d1', 'BILD Certified Course: A', 'BILD_ADVANCED_TRAINER', '2022-03-03', false),
('5beb390c-450b-40b2-905e-d79d54b9daca', 10033, 'B.BILD-INT.F.CL.PSTI.10033', '2025-05-05', '2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false),
('4fff750b-ef54-461c-806e-0f087a7efae0', 10033, 'B.BILD-INT.F.CL.PSTI.10033', '2025-05-05', 'c15a4b34-bb98-4096-ae2e-ea280fb14e05', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false),
('b76ec0ea-7f48-4a91-9806-e517d97df17d', 10033, 'B.BILD-INT.F.CL.PSTI.10033', '2025-05-05', '729e3ed4-f86e-41a7-9e29-c6387b9fbaa6', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false);
