INSERT INTO profile (id, dob, _given_name, _family_name, _email, _phone) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', '1981-08-01', 'John', 'Trainer', 'trainer@teamteach.testinator.com', '+44 55 5555 5555'),
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', '1981-08-01', 'Mark', 'Trainer', 'trainer.with.org@teamteach.testinator.com', '+44 55 5555 5555'),
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', '1981-08-01', 'Steven', 'Trainer', 'trainer.and.user@teamteach.testinator.com', '+44 55 5555 5555'),
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', '1981-08-01', 'Liam', 'Assistant', 'assistant@teamteach.testinator.com', '+44 55 5555 5555'),
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', '1981-08-01', 'Noah', 'Assistant', 'assistant.with.org@teamteach.testinator.com', '+44 55 5555 5555'),
('6b72504a-6447-4b30-9909-e8e6fc1d300f', '1981-08-01', 'Oliver', 'Participant', 'user1@teamteach.testinator.com', '+44 55 5555 5555'),
('d394a9ff-7517-4e35-91aa-466f9d4c1b77', '1981-08-01', 'Elijah', 'Participant', 'user2@teamteach.testinator.com', '+44 55 5555 5555'),
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', '1981-08-01', 'William', 'Participant', 'user1.with.org@teamteach.testinator.com', '+44 55 5555 5555'),
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', '1981-08-01', 'James', 'Participant', 'user2.with.org@teamteach.testinator.com', '+44 55 5555 5555'),
('22015a3e-8907-4333-8811-85f782265a63', '1981-08-01', 'Benjamin', 'Admin', 'adm@teamteach.testinator.com', '+44 55 5555 5555'),
('48c9c19b-e7bf-4309-9679-52d5619d27dd', '1981-08-01', 'Lucas', 'Ops', 'ops@teamteach.testinator.com', '+44 55 5555 5555'),
('48812860-89a5-41be-95c9-b8889e88bffd', '1981-08-01', 'Henry', 'Moderator', 'moderator@teamteach.testinator.com', '+44 55 5555 5555'),
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', '1981-08-01', 'Alex', 'Admin', 'org.adm@teamteach.testinator.com', '+44 55 5555 5555'),
('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', '1981-08-01', 'Logan', 'Password', 'password@teamteach.testinator.com', '+44 55 5555 5555'),
('921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', '1981-08-01', 'One', 'Trainer', 'trainer01@teamteach.testinator.com', '+44 55 5555 5555'),
('30ebb1e1-0491-44f8-b0a2-3087bd454b19', '1981-08-01', 'Two', 'Trainer', 'trainer02@teamteach.testinator.com', '+44 55 5555 5555'),
('e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', '1981-08-01', 'Three', 'Trainer', 'trainer03@teamteach.testinator.com', '+44 55 5555 5555'),
('d54f86ca-0181-4264-8c73-7b73ff395405', '1981-08-01', 'Four', 'Trainer', 'trainer04@teamteach.testinator.com', '+44 55 5555 5555'),
('62946c00-1da3-44f7-97a6-4b1c8da4f2ef', '1981-08-01', 'Five', 'Trainer', 'trainer05@teamteach.testinator.com', '+44 55 5555 5555'),
('8ba2c43e-a7e5-47c5-8d03-0383719d77df', '1981-08-01', 'Six', 'Trainer', 'trainer06@teamteach.testinator.com', '+44 55 5555 5555'),
('2a451ef2-99fe-4350-9f0e-2081b6f3f87f', '1981-08-01', 'Seven', 'Trainer', 'trainer07@teamteach.testinator.com', '+44 55 5555 5555'),
('14184530-d2a8-4cc2-ad42-2b7312aa5b3d', '1981-08-01', 'Eight', 'Trainer', 'trainer08@teamteach.testinator.com', '+44 55 5555 5555'),
('d7c8cfe9-827c-4fc5-88b6-1a799d02dd81', '1981-08-01', 'Nine', 'Trainer', 'trainer09@teamteach.testinator.com', '+44 55 5555 5555'),
('b414536d-29dd-4902-81f9-e808503428ee', '1981-08-01', 'Ten', 'Trainer', 'trainer10@teamteach.testinator.com', '+44 55 5555 5555'),
('7a35d3ce-cc02-4a66-9446-16b6740bfb23', '1981-08-01', 'Sales', 'Admin', 'sales.adm@teamteach.testinator.com', '+44 55 5555 5555'),
('6987feba-0877-4a2a-b7da-982de1977eb3', '1981-08-01', 'Learning', 'Development', 'ld@teamteach.testinator.com', '+44 55 5555 5555');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('b7cc8b4e-b567-42d2-8edf-0b359fb68171', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com
('966a5a92-b112-48d3-9031-31d85b5e14b4', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com staging

('d0cc2f0d-4e1c-4f77-9f97-132fbe72b1d8', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'cognito'), -- trainer.with.org@teamteach.testinator.com
('42d5e858-a41e-4589-adc5-499d643c5771', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'cognito'), -- trainer.with.org@teamteach.testinator.com staging

('d1f28bee-86d5-44d8-a9bb-930af486656a', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'cognito'), -- trainer.and.user@teamteach.testinator.com
('33e445ce-7fd5-4125-8d48-0643151fe588', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'cognito'), -- trainer.and.user@teamteach.testinator.com staging

('1206ea64-e309-4162-9f3b-db827a84645a', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'cognito'), -- assistant@teamteach.testinator.com
('d1b41d43-5796-4560-8f40-d3f0f22fa242', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'cognito'), -- assistant@teamteach.testinator.com staging

('6e40604a-651f-4a62-bba1-323e585808de', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'cognito'), -- assistant.with.org@teamteach.testinator.com
('6b59bac0-91cc-453e-9df5-cba479fddd3e', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'cognito'), -- assistant.with.org@teamteach.testinator.com staging

('a9260d24-b804-49bb-9d2b-5b79b6c13cb7', '6b72504a-6447-4b30-9909-e8e6fc1d300f', 'cognito'), -- user1@teamteach.testinator.com
('5fb6bb03-6c64-4c49-bae7-e8810c27b994', '6b72504a-6447-4b30-9909-e8e6fc1d300f', 'cognito'), -- user1@teamteach.testinator.com staging

('589ce6c3-2a8d-4d4f-b1cf-980ea3c36e64', 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', 'cognito'), -- user2@teamteach.testinator.com
('40eff78d-fff8-467f-b95d-fb26683263e5', 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', 'cognito'), -- user2@teamteach.testinator.com staging

('890ec06c-6a6a-454c-a7cb-fb11c53a80a4', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'cognito'), -- user1.with.org@teamteach.testinator.com
('6bb0cf5c-54eb-4432-a9df-5dc61445a02c', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'cognito'), -- user1.with.org@teamteach.testinator.com staging

('07599256-fd33-40c4-b1e5-2405615b3094', 'a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'cognito'), -- user2.with.org@teamteach.testinator.com
('a015e6c9-c8c9-4de8-b762-aaebd7b747ec', 'a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'cognito'), -- user2.with.org@teamteach.testinator.com staging

('fb55906e-bdf3-4756-81c9-fb3315f84316', '22015a3e-8907-4333-8811-85f782265a63', 'cognito'), -- adm@teamteach.testinator.com
('34c565f8-0932-459e-8d2c-dac35d369326', '22015a3e-8907-4333-8811-85f782265a63', 'cognito'), -- adm@teamteach.testinator.com staging

('f562f82d-87c7-472b-8141-0ec4f465d9fa', '48c9c19b-e7bf-4309-9679-52d5619d27dd', 'cognito'), -- ops@teamteach.testinator.com
('bfa79d96-3b2a-471b-bcd4-f8edc8fb0fb9', '48c9c19b-e7bf-4309-9679-52d5619d27dd', 'cognito'), -- ops@teamteach.testinator.com staging

('443abe40-c9f8-4fb1-af33-3f1c602ca754', '48812860-89a5-41be-95c9-b8889e88bffd', 'cognito'), -- moderator@teamteach.testinator.com
('281fbeeb-99a3-46d0-81b6-c3dca984d1af', '48812860-89a5-41be-95c9-b8889e88bffd', 'cognito'), -- moderator@teamteach.testinator.com staging

('c6bfe325-a350-43fb-b149-7e6a1e457176', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'cognito'), -- org.adm@teamteach.testinator.com
('8080870a-9be0-4a16-97f5-3cb2b29a8c65', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'cognito'), -- org.adm@teamteach.testinator.com staging

('c353ca53-bc7f-46e0-8736-920acb4ccce8', '8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'cognito'), -- password@teamteach.testinator.com
('c47a09ce-59b9-4c2d-a038-cea7adf4d711', '8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'cognito'), -- password@teamteach.testinator.com staging

('1252e945-3ef3-4e13-9a7c-595119e2164e', '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'cognito'), -- trainer01@teamteach.testinator.com
('5abd6b91-6d6b-4fd4-9fac-9798158fe22a', '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'cognito'), -- trainer01@teamteach.testinator.com staging

('77fc1523-a29e-4520-8ac4-26ee08b38253', '30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'cognito'), -- trainer02@teamteach.testinator.com
('1b1bbae4-1dd6-4170-909d-4c1907510ba3', '30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'cognito'), -- trainer02@teamteach.testinator.com staging

('f6adac99-2adb-440f-a2d5-0ed3bce0fb6b', 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'cognito'), -- trainer03@teamteach.testinator.com
('766a3a28-b9c9-4af2-af4f-2e316d68f91f', 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'cognito'), -- trainer03@teamteach.testinator.com staging

('75e38dc1-c482-48db-9608-f2eb14cf5ff3', 'd54f86ca-0181-4264-8c73-7b73ff395405', 'cognito'), -- trainer04@teamteach.testinator.com
('116dc1f9-09e1-4071-be6a-c44a4235629e', 'd54f86ca-0181-4264-8c73-7b73ff395405', 'cognito'), -- trainer04@teamteach.testinator.com staging

('9ad418c5-98dd-4b75-9780-dca6e3733ba0', '62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 'cognito'), -- trainer05@teamteach.testinator.com
('05164cb0-f6c2-4aa5-82ba-4af967705225', '62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 'cognito'), -- trainer05@teamteach.testinator.com staging

('4e12f5b1-e00b-4f78-85be-7bbc50364b4b', '8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'cognito'), -- trainer06@teamteach.testinator.com
('85ac2061-a97c-4923-8712-2c9ba254dfaa', '8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'cognito'), -- trainer06@teamteach.testinator.com staging

('06893434-6751-4b7b-bec5-9899b5c65ce0', '2a451ef2-99fe-4350-9f0e-2081b6f3f87f', 'cognito'), -- trainer07@teamteach.testinator.com
('9032c2b4-b607-42f7-8fd4-39884a4986cb', '2a451ef2-99fe-4350-9f0e-2081b6f3f87f', 'cognito'), -- trainer07@teamteach.testinator.com staging

('506cb826-4b55-4022-babf-2218613149ae', '14184530-d2a8-4cc2-ad42-2b7312aa5b3d', 'cognito'), -- trainer08@teamteach.testinator.com
('952af9c2-a02e-4ceb-92ef-d6a4bf08c108', '14184530-d2a8-4cc2-ad42-2b7312aa5b3d', 'cognito'), -- trainer08@teamteach.testinator.com staging

('65031550-3747-4641-af93-3151e8783df6', 'd7c8cfe9-827c-4fc5-88b6-1a799d02dd81', 'cognito'), -- trainer09@teamteach.testinator.com
('1c8f03ac-f7fb-4dac-a89d-a76da53e9cd6', 'd7c8cfe9-827c-4fc5-88b6-1a799d02dd81', 'cognito'), -- trainer09@teamteach.testinator.com staging

('1ed2466b-8faa-4a2e-aadf-db4c81906f9b', 'b414536d-29dd-4902-81f9-e808503428ee', 'cognito'), -- trainer10@teamteach.testinator.com
('34559459-91f6-4fc8-b9c4-0daab3215a70', 'b414536d-29dd-4902-81f9-e808503428ee', 'cognito'), -- trainer10@teamteach.testinator.com staging

('a289e6fc-8502-4906-8160-b1123d754ec6', '7a35d3ce-cc02-4a66-9446-16b6740bfb23', 'cognito'), -- sales.adm@teamteach.testinator.com
('99707aa6-356e-421b-99b3-aecda469fa7c', '7a35d3ce-cc02-4a66-9446-16b6740bfb23', 'cognito'), -- sales.adm@teamteach.testinator.com staging

('c42c2f47-a9db-49cb-89fd-9033b8219ebc', '6987feba-0877-4a2a-b7da-982de1977eb3', 'cognito'), -- ld@teamteach.testinator.com
('95c516f6-439e-463d-81d4-417fbe2ba638', '6987feba-0877-4a2a-b7da-982de1977eb3', 'cognito'); -- ld@teamteach.testinator.com staging

-- Adding roles to test users
INSERT INTO profile_role (profile_id, role_id) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', (SELECT id from role WHERE name = 'trainer')), -- trainer@teamteach.testinator.com
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', (SELECT id from role WHERE name = 'trainer')), -- trainer.with.org@teamteach.testinator.com
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', (SELECT id from role WHERE name = 'trainer')), -- trainer.and.user@teamteach.testinator.com
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', (SELECT id from role WHERE name = 'trainer')), -- assistant@teamteach.testinator.com
('6b72504a-6447-4b30-9909-e8e6fc1d300f', (SELECT id from role WHERE name = 'user')), -- user1@teamteach.testinator.com
('d394a9ff-7517-4e35-91aa-466f9d4c1b77', (SELECT id from role WHERE name = 'user')), -- user2@teamteach.testinator.com
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', (SELECT id from role WHERE name = 'user')), -- user1.with.org@teamteach.testinator.com
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', (SELECT id from role WHERE name = 'user')), -- user2.with.org@teamteach.testinator.com
('22015a3e-8907-4333-8811-85f782265a63', (SELECT id from role WHERE name = 'tt-admin')), -- adm@teamteach.testinator.com
('48c9c19b-e7bf-4309-9679-52d5619d27dd', (SELECT id from role WHERE name = 'tt-ops')), -- ops@teamteach.testinator.com
('48812860-89a5-41be-95c9-b8889e88bffd', (SELECT id from role WHERE name = 'tt-ops')), -- moderator@teamteach.testinator.com
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', (SELECT id from role WHERE name = 'user')), -- org.adm@teamteach.testinator.com
('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', (SELECT id from role WHERE name = 'trainer')), -- password@teamteach.testinator.com
('921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', (SELECT id from role WHERE name = 'trainer')), -- trainer01@teamteach.testinator.com
('30ebb1e1-0491-44f8-b0a2-3087bd454b19', (SELECT id from role WHERE name = 'trainer')), -- trainer02@teamteach.testinator.com
('e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', (SELECT id from role WHERE name = 'trainer')), -- trainer03@teamteach.testinator.com
('d54f86ca-0181-4264-8c73-7b73ff395405', (SELECT id from role WHERE name = 'trainer')), -- trainer04@teamteach.testinator.com
('62946c00-1da3-44f7-97a6-4b1c8da4f2ef', (SELECT id from role WHERE name = 'trainer')), -- trainer05@teamteach.testinator.com
('8ba2c43e-a7e5-47c5-8d03-0383719d77df', (SELECT id from role WHERE name = 'trainer')), -- trainer06@teamteach.testinator.com
('2a451ef2-99fe-4350-9f0e-2081b6f3f87f', (SELECT id from role WHERE name = 'trainer')), -- trainer07@teamteach.testinator.com
('14184530-d2a8-4cc2-ad42-2b7312aa5b3d', (SELECT id from role WHERE name = 'trainer')), -- trainer08@teamteach.testinator.com
('d7c8cfe9-827c-4fc5-88b6-1a799d02dd81', (SELECT id from role WHERE name = 'trainer')), -- trainer09@teamteach.testinator.com
('b414536d-29dd-4902-81f9-e808503428ee', (SELECT id from role WHERE name = 'trainer')), -- trainer10@teamteach.testinator.com
('7a35d3ce-cc02-4a66-9446-16b6740bfb23', (SELECT id from role WHERE name = 'sales-admin')), -- sales.adm@teamteach.testinator.com
('6987feba-0877-4a2a-b7da-982de1977eb3', (SELECT id from role WHERE name = 'ld')); -- ld@teamteach.testinator.com

INSERT INTO organization (id, name, original_record, address) VALUES
('55320dc6-cfb0-41fb-9000-ca7eb9d2894d', 'NearForm', '{}', '{"line1": "Tankfield, Convent Hill", "line2": "Tramore", "city": "Waterford", "postCode": "X91 PV08"}'),
('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'London First School', '{}', '{"line1": "107 Queen Victoria Street", "city": "London", "postCode": "EC4V 3AL"}');

INSERT INTO organization_member (profile_id, organization_id) VALUES
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- trainer.with.org@teamteach.testinator.com
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- assistant.with.org@teamteach.testinator.com
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- user1.with.org@teamteach.testinator.com
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- user2.with.org@teamteach.testinator.com
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- org.adm@teamteach.testinator.com
('921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer01@teamteach.testinator.com
('30ebb1e1-0491-44f8-b0a2-3087bd454b19', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer02@teamteach.testinator.com
('e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer03@teamteach.testinator.com
('d54f86ca-0181-4264-8c73-7b73ff395405', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer04@teamteach.testinator.com
('62946c00-1da3-44f7-97a6-4b1c8da4f2ef', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer05@teamteach.testinator.com
('8ba2c43e-a7e5-47c5-8d03-0383719d77df', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer06@teamteach.testinator.com
('2a451ef2-99fe-4350-9f0e-2081b6f3f87f', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer07@teamteach.testinator.com
('14184530-d2a8-4cc2-ad42-2b7312aa5b3d', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer08@teamteach.testinator.com
('d7c8cfe9-827c-4fc5-88b6-1a799d02dd81', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer09@teamteach.testinator.com
('b414536d-29dd-4902-81f9-e808503428ee', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'); -- trainer10@teamteach.testinator.com

UPDATE organization_member SET is_admin = true WHERE profile_id = 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa';
