INSERT INTO profile (id, _given_name, _family_name, _email) VALUES
('5bc30260-04fb-41a4-bd29-07c5f433d904', 'Bild', 'Intermediate', 'bild.intermediate@teamteach.testinator.com'),
('1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'Bild', 'Advanced', 'bild.advanced@teamteach.testinator.com'),
('2be41d95-40ee-49d5-810c-fae16135cccc', 'Bild', 'Senior', 'bild.senior@teamteach.testinator.com'),
('2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'Bild', 'Certified', 'bild.certified@teamteach.testinator.com');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('f877d001-d2ff-49d5-99c9-5be70d8cea6f', '5bc30260-04fb-41a4-bd29-07c5f433d904', 'cognito'), -- bild.intermediate@teamteach.testinator.com
('e8824958-7460-4a1c-8db8-edd18dfb033b', '5bc30260-04fb-41a4-bd29-07c5f433d904', 'cognito'), -- bild.intermediate@teamteach.testinator.com staging

('7b5baeb7-d365-4918-9d5d-32e3e97e20ac', '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'cognito'), -- bild.advanced@teamteach.testinator.com
('9740a79d-3d64-4d8f-b8fa-58525780e845', '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'cognito'), -- bild.advanced@teamteach.testinator.com staging

('e1e2b168-b75c-4e0c-b085-f1425d0b0951', '2be41d95-40ee-49d5-810c-fae16135cccc', 'cognito'), -- bild.senior@teamteach.testinator.com
('e0ac8629-257b-41c7-b5cd-228593cef804', '2be41d95-40ee-49d5-810c-fae16135cccc', 'cognito'), -- bild.senior@teamteach.testinator.com staging

('6029d762-9b72-4129-9bcd-0c2b41abe102', '2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'cognito'), -- bild.certified@teamteach.testinator.com
('8f21d99e-68f1-408b-b1c3-836d55ecb61b', '2c4b16db-bfba-4a21-a092-55ef9010ca2f', 'cognito'); -- bild.certified@teamteach.testinator.com staging


INSERT INTO profile_role (profile_id, role_id) VALUES
('5bc30260-04fb-41a4-bd29-07c5f433d904', (SELECT id from role WHERE name = 'trainer')), -- bild.intermediate@teamteach.testinator.com
('1b37b4d3-0dcc-4f17-96d5-bc27c029010f', (SELECT id from role WHERE name = 'trainer')), -- bild.advanced@teamteach.testinator.com
('2be41d95-40ee-49d5-810c-fae16135cccc', (SELECT id from role WHERE name = 'trainer')), -- bild.senior@teamteach.testinator.com
('2c4b16db-bfba-4a21-a092-55ef9010ca2f', (SELECT id from role WHERE name = 'trainer')); -- bild.certified@teamteach.testinator.com

INSERT INTO public.profile_trainer_role_type (profile_id, trainer_role_type_id) VALUES
('2be41d95-40ee-49d5-810c-fae16135cccc', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-senior')),
('2c4b16db-bfba-4a21-a092-55ef9010ca2f', (SELECT id FROM public.trainer_role_type WHERE name = 'bild-certified'));

INSERT INTO public.course_invites (id, email, status, course_id) VALUES
('2b70862b-9ef7-412f-b742-d9a159c46151', 'bild.intermediate@teamteach.testinator.com', 'ACCEPTED', 10033),
('bc01e1c9-c4e5-4d87-8364-86d8d5e48461', 'bild.advanced@teamteach.testinator.com', 'ACCEPTED', 10034);

INSERT INTO public.course_participant (id, course_id, profile_id, invite_id) VALUES
('0af7536e-b396-490a-b7e8-eb4c5152c84e', 10033, '5bc30260-04fb-41a4-bd29-07c5f433d904', '2b70862b-9ef7-412f-b742-d9a159c46151'),
('0ec89029-dadd-420e-8f9d-956f005fa549', 10034, '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'bc01e1c9-c4e5-4d87-8364-86d8d5e48461');

INSERT INTO public.course_certificate (id, course_id, number, expiry_date, profile_id, course_name, course_level, certification_date, is_revoked) VALUES
('0413cb5f-c04d-403c-b76f-23025c91de25', 10033, 'CL-BILD-10033-1', '2025-05-05', '5bc30260-04fb-41a4-bd29-07c5f433d904', 'BILD Certified Course: PSTI', 'BILD_INTERMEDIATE_TRAINER', '2022-03-03', false),
('1a98205a-e742-49d5-a852-0a148d74bb16', 10034, 'OP-BILD-10034-2', '2025-05-05', '1b37b4d3-0dcc-4f17-96d5-bc27c029010f', 'BILD Certified Course: A', 'BILD_ADVANCED_TRAINER', '2022-03-03', false);

