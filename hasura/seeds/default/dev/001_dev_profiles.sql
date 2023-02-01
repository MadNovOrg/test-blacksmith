INSERT INTO profile (id, given_name, family_name, email) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'John', 'Trainer', 'trainer@teamteach.testinator.com'),
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'Mark', 'Trainer', 'trainer.with.org@teamteach.testinator.com'),
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'Steven', 'Trainer', 'trainer.and.user@teamteach.testinator.com'),
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'Liam', 'Assistant', 'assistant@teamteach.testinator.com'),
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'Noah', 'Assistant', 'assistant.with.org@teamteach.testinator.com'),
('6b72504a-6447-4b30-9909-e8e6fc1d300f', 'Oliver', 'Participant', 'user1@teamteach.testinator.com'),
('d394a9ff-7517-4e35-91aa-466f9d4c1b77', 'Elijah', 'Participant', 'user2@teamteach.testinator.com'),
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'William', 'Participant', 'user1.with.org@teamteach.testinator.com'),
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'James', 'Participant', 'user2.with.org@teamteach.testinator.com'),
('22015a3e-8907-4333-8811-85f782265a63', 'Benjamin', 'Admin', 'adm@teamteach.testinator.com'),
('48c9c19b-e7bf-4309-9679-52d5619d27dd', 'Lucas', 'Ops', 'ops@teamteach.testinator.com'),
('48812860-89a5-41be-95c9-b8889e88bffd', 'Henry', 'Moderator', 'moderator@teamteach.testinator.com'),
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'Alex', 'Admin', 'org.adm@teamteach.testinator.com'),
('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'Logan', 'Password', 'password@teamteach.testinator.com'),
('921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'One', 'Trainer', 'trainer01@teamteach.testinator.com'),
('30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'Two', 'Trainer', 'trainer02@teamteach.testinator.com'),
('e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'Three', 'Trainer', 'trainer03@teamteach.testinator.com'),
('d54f86ca-0181-4264-8c73-7b73ff395405', 'Four', 'Trainer', 'trainer04@teamteach.testinator.com'),
('62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 'Five', 'Trainer', 'trainer05@teamteach.testinator.com'),
('8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'Six', 'Trainer', 'trainer06@teamteach.testinator.com'),
('2a451ef2-99fe-4350-9f0e-2081b6f3f87f', 'Seven', 'Trainer', 'trainer07@teamteach.testinator.com'),
('14184530-d2a8-4cc2-ad42-2b7312aa5b3d', 'Eight', 'Trainer', 'trainer08@teamteach.testinator.com'),
('d7c8cfe9-827c-4fc5-88b6-1a799d02dd81', 'Nine', 'Trainer', 'trainer09@teamteach.testinator.com'),
('b414536d-29dd-4902-81f9-e808503428ee', 'Ten', 'Trainer', 'trainer10@teamteach.testinator.com'),
('7a35d3ce-cc02-4a66-9446-16b6740bfb23', 'Sales', 'Admin', 'sales.adm@teamteach.testinator.com'),
('6987feba-0877-4a2a-b7da-982de1977eb3', 'Learning', 'Development', 'ld@teamteach.testinator.com');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('fa021939-81e5-4101-8f8b-c02d28b127be', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com
('966a5a92-b112-48d3-9031-31d85b5e14b4', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com staging

('49f998c9-dfc7-4a02-8de1-2207a1bd93d9', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'cognito'), -- trainer.with.org@teamteach.testinator.com
('42d5e858-a41e-4589-adc5-499d643c5771', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'cognito'), -- trainer.with.org@teamteach.testinator.com staging

('d96bafb4-5605-4029-99b9-792702727519', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'cognito'), -- trainer.and.user@teamteach.testinator.com
('33e445ce-7fd5-4125-8d48-0643151fe588', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'cognito'), -- trainer.and.user@teamteach.testinator.com staging

('f741910a-7680-4082-8910-99b7bbf807eb', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'cognito'), -- assistant@teamteach.testinator.com
('d1b41d43-5796-4560-8f40-d3f0f22fa242', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'cognito'), -- assistant@teamteach.testinator.com staging

('df720183-c8e6-4f29-ac96-4e443eec0550', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'cognito'), -- assistant.with.org@teamteach.testinator.com
('6b59bac0-91cc-453e-9df5-cba479fddd3e', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'cognito'), -- assistant.with.org@teamteach.testinator.com staging

('3e904cc3-c091-4cb6-90c9-c7aece4558a9', '6b72504a-6447-4b30-9909-e8e6fc1d300f', 'cognito'), -- user1@teamteach.testinator.com
('5fb6bb03-6c64-4c49-bae7-e8810c27b994', '6b72504a-6447-4b30-9909-e8e6fc1d300f', 'cognito'), -- user1@teamteach.testinator.com staging

('828d9bac-bb11-4d54-ad52-41f8e04d49a6', 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', 'cognito'), -- user2@teamteach.testinator.com
('40eff78d-fff8-467f-b95d-fb26683263e5', 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', 'cognito'), -- user2@teamteach.testinator.com staging

('9201c823-8380-46c5-a618-47d0abe2d9ae', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'cognito'), -- user1.with.org@teamteach.testinator.com
('6bb0cf5c-54eb-4432-a9df-5dc61445a02c', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'cognito'), -- user1.with.org@teamteach.testinator.com staging

('fa6d5346-465a-4b34-8294-a4a5e256ee5c', 'a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'cognito'), -- user2.with.org@teamteach.testinator.com
('570f4fd2-eb0f-4dbb-9c52-a118e26fdf42', 'a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'cognito'), -- user2.with.org@teamteach.testinator.com staging

('8ca1d482-7e20-4448-8eb6-946550e01b1e', '22015a3e-8907-4333-8811-85f782265a63', 'cognito'), -- adm@teamteach.testinator.com
('34c565f8-0932-459e-8d2c-dac35d369326', '22015a3e-8907-4333-8811-85f782265a63', 'cognito'), -- adm@teamteach.testinator.com staging

('f04574f6-893f-4ff0-bae5-8cd58ea9e065', '48c9c19b-e7bf-4309-9679-52d5619d27dd', 'cognito'), -- ops@teamteach.testinator.com
('2c436c6a-db32-4b91-ba8a-bcabc1a7affa', '48c9c19b-e7bf-4309-9679-52d5619d27dd', 'cognito'), -- ops@teamteach.testinator.com staging

('a33cc575-1642-4435-87bf-21edaebb52e9', '48812860-89a5-41be-95c9-b8889e88bffd', 'cognito'), -- moderator@teamteach.testinator.com
('281fbeeb-99a3-46d0-81b6-c3dca984d1af', '48812860-89a5-41be-95c9-b8889e88bffd', 'cognito'), -- moderator@teamteach.testinator.com staging

('99ac246d-1b0a-4075-bff6-1550330c5ea8', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'cognito'), -- org.adm@teamteach.testinator.com
('8080870a-9be0-4a16-97f5-3cb2b29a8c65', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'cognito'), -- org.adm@teamteach.testinator.com staging

('9e148a44-ee2f-446d-a188-da5dfdb0f6ac', '8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'cognito'), -- password@teamteach.testinator.com
('90f81462-ccbc-44c2-bf46-ceedea2f383f', '8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'cognito'), -- password@teamteach.testinator.com staging

('854aaf25-9c84-461d-9ff6-dd9a022a2eb5', '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'cognito'), -- trainer01@teamteach.testinator.com
('5abd6b91-6d6b-4fd4-9fac-9798158fe22a', '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6', 'cognito'), -- trainer01@teamteach.testinator.com staging

('cf937e22-7688-47c5-935d-227a41bf5bf4', '30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'cognito'), -- trainer02@teamteach.testinator.com
('1b1bbae4-1dd6-4170-909d-4c1907510ba3', '30ebb1e1-0491-44f8-b0a2-3087bd454b19', 'cognito'), -- trainer02@teamteach.testinator.com staging

('c6433596-ffee-44e9-8239-68f5a12cb2e2', 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'cognito'), -- trainer03@teamteach.testinator.com
('766a3a28-b9c9-4af2-af4f-2e316d68f91f', 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9', 'cognito'), -- trainer03@teamteach.testinator.com staging

('7aa06b76-aefb-4af0-8220-3a3bc5ba3c82', 'd54f86ca-0181-4264-8c73-7b73ff395405', 'cognito'), -- trainer04@teamteach.testinator.com
('116dc1f9-09e1-4071-be6a-c44a4235629e', 'd54f86ca-0181-4264-8c73-7b73ff395405', 'cognito'), -- trainer04@teamteach.testinator.com staging

('680d6442-1560-4a1f-ba40-14203e3abb6f', '62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 'cognito'), -- trainer05@teamteach.testinator.com
('05164cb0-f6c2-4aa5-82ba-4af967705225', '62946c00-1da3-44f7-97a6-4b1c8da4f2ef', 'cognito'), -- trainer05@teamteach.testinator.com staging

('0ab0bebe-d25e-4b6a-917b-85b61ae6956b', '8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'cognito'), -- trainer06@teamteach.testinator.com
('85ac2061-a97c-4923-8712-2c9ba254dfaa', '8ba2c43e-a7e5-47c5-8d03-0383719d77df', 'cognito'), -- trainer06@teamteach.testinator.com staging

('24458448-7e3d-479f-bce5-8e2e9f588dbf', '2a451ef2-99fe-4350-9f0e-2081b6f3f87f', 'cognito'), -- trainer07@teamteach.testinator.com
('9032c2b4-b607-42f7-8fd4-39884a4986cb', '2a451ef2-99fe-4350-9f0e-2081b6f3f87f', 'cognito'), -- trainer07@teamteach.testinator.com staging

('637094bf-e72d-470a-b909-60e3eb26a23f', '14184530-d2a8-4cc2-ad42-2b7312aa5b3d', 'cognito'), -- trainer08@teamteach.testinator.com
('952af9c2-a02e-4ceb-92ef-d6a4bf08c108', '14184530-d2a8-4cc2-ad42-2b7312aa5b3d', 'cognito'), -- trainer08@teamteach.testinator.com staging

('ac877f52-0764-43e8-b66c-67d6061d0c6f', 'd7c8cfe9-827c-4fc5-88b6-1a799d02dd81', 'cognito'), -- trainer09@teamteach.testinator.com
('3543318d-d9ce-480f-8fef-822011bf2b71', 'd7c8cfe9-827c-4fc5-88b6-1a799d02dd81', 'cognito'), -- trainer09@teamteach.testinator.com staging

('c898e47b-99d4-4e5a-a0f2-3b41cf05bab6', 'b414536d-29dd-4902-81f9-e808503428ee', 'cognito'), -- trainer10@teamteach.testinator.com
('34559459-91f6-4fc8-b9c4-0daab3215a70', 'b414536d-29dd-4902-81f9-e808503428ee', 'cognito'), -- trainer10@teamteach.testinator.com staging

('83050492-393c-4e3e-94b3-1ffd49014fbb', '7a35d3ce-cc02-4a66-9446-16b6740bfb23', 'cognito'), -- sales.adm@teamteach.testinator.com
('99707aa6-356e-421b-99b3-aecda469fa7c', '7a35d3ce-cc02-4a66-9446-16b6740bfb23', 'cognito'), -- sales.adm@teamteach.testinator.com staging

('04f81b0c-286b-4415-bf7d-17b3b0f3e991', '6987feba-0877-4a2a-b7da-982de1977eb3', 'cognito'), -- ld@teamteach.testinator.com
('f6edff23-9ef5-4843-8e13-64610b4cfa41', '6987feba-0877-4a2a-b7da-982de1977eb3', 'cognito'); -- ld@teamteach.testinator.com staging

-- Adding roles to test users
INSERT INTO profile_role (profile_id, role_id) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', (SELECT id from role WHERE name = 'trainer')), -- trainer@teamteach.testinator.com
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', (SELECT id from role WHERE name = 'trainer')), -- trainer.with.org@teamteach.testinator.com
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', (SELECT id from role WHERE name = 'trainer')), -- trainer.and.user@teamteach.testinator.com
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', (SELECT id from role WHERE name = 'trainer')), -- assistant@teamteach.testinator.com
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', (SELECT id from role WHERE name = 'trainer')), -- assistant.with.org@teamteach.testinator.com
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
