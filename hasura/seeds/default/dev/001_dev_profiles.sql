INSERT INTO profile (id, given_name, family_name, contact_details) VALUES
('434de6da-cdc5-431b-b109-022854319d69', 'Jon-Paul', 'Little', '[ { "type": "email", "value": "jonpaul.little@teamteach.co.uk" } ]'),
('77eaddad-ba95-4ab7-9ef7-801b347d6502', 'Andrew', 'Winterbotham', '[ { "type": "email", "value": "andrew.winterbotham@nearform.com" } ]'),
('fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'Greg', 'Ilach', '[ { "type": "email", "value": "grzegorz.ilach@nearform.com" } ]'),
('bb665826-8ff0-45f7-a75f-babdad3d8e17', 'Salman', 'Mitha', '[ { "type": "email", "value": "salman.mitha@nearform.com" } ]'),
('83156e3f-a075-43b5-b345-dacb06d5b057', 'Aneesa', 'Ramzan', '[ { "type": "email", "value": "aneesa.ramzan@teamteach.co.uk" } ]'),
('aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'Spyridon', 'Chortis', '[ { "type": "email", "value": "spyridon.chortis@nearform.com" } ]'),
('99a03e41-f518-49a2-98cd-c77cb2e33483', 'Maksym', 'Barvinskyi', '[ { "type": "email", "value": "maksym.barvinskyi@nearform.com" } ]'),
('ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'Lefteris', 'Paraskevas', '[ { "type": "email", "value": "lefteris.paraskevas@nearform.com" } ]'),
('7eb8bd38-3048-4416-90d2-4b2299e4633b', 'Alex', 'Parra', '[ { "type": "email", "value": "alex.parra@nearform.com" } ]'),
('7584edda-3772-447c-9162-25f7fc6a9b38', 'Danijel', 'Maksimovic', '[ { "type": "email", "value": "danijel.maksimovic@nearform.com" } ]'),
('8fc963f5-1942-4e70-9107-7a84fe2e68d5', 'Piotr', 'Piech', '[ { "type": "email", "value": "piotr.piech@nearform.com" } ]'),
-- test users
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'John', 'Trainer', '[ { "type": "email", "value": "trainer@teamteach.testinator.com" } ]'),
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'Mark', 'Trainer', '[ { "type": "email", "value": "trainer.with.org@teamteach.testinator.com" } ]'),
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'Steven', 'Trainer', '[ { "type": "email", "value": "trainer.and.user@teamteach.testinator.com" } ]'),
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'Liam', 'Assistant', '[ { "type": "email", "value": "assistant@teamteach.testinator.com" } ]'),
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'Noah', 'Assistant', '[ { "type": "email", "value": "assistant.with.org@teamteach.testinator.com" } ]'),
('6b72504a-6447-4b30-9909-e8e6fc1d300f', 'Oliver', 'Participant', '[ { "type": "email", "value": "user1@teamteach.testinator.com" } ]'),
('d394a9ff-7517-4e35-91aa-466f9d4c1b77', 'Elijah', 'Participant', '[ { "type": "email", "value": "user2@teamteach.testinator.com" } ]'),
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'William', 'Participant', '[ { "type": "email", "value": "user1.with.org@teamteach.testinator.com" } ]'),
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'James', 'Participant', '[ { "type": "email", "value": "user2.with.org@teamteach.testinator.com" } ]'),
('22015a3e-8907-4333-8811-85f782265a63', 'Benjamin', 'Admin', '[ { "type": "email", "value": "admin@teamteach.testinator.com" } ]'),
('48c9c19b-e7bf-4309-9679-52d5619d27dd', 'Lucas', 'Ops', '[ { "type": "email", "value": "ops@teamteach.testinator.com" } ]'),
('48812860-89a5-41be-95c9-b8889e88bffd', 'Henry', 'Moderator', '[ { "type": "email", "value": "moderator@teamteach.testinator.com" } ]'),
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'Alex', 'Admin', '[ { "type": "email", "value": "org.admin@teamteach.testinator.com" } ]'),
('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'Logan', 'Password', '[ { "type": "email", "value": "password@teamteach.testinator.com" } ]');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('9b0c754a-c12f-4f04-a554-cd899a09484d', '434de6da-cdc5-431b-b109-022854319d69', 'cognito'), -- jonpaul.little@teamteach.co.uk
('25ddb680-8dca-4c5d-925f-eb6824c2ab08', '77eaddad-ba95-4ab7-9ef7-801b347d6502', 'cognito'), -- andrew.winterbotham@nearform.com
('0d9f639e-1cd2-4a6b-a066-c693e573caa4', 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'cognito'), -- grzegorz.ilach@nearform.com
('eff19c8c-5c44-412d-bbcf-d5f039aa2c97', 'bb665826-8ff0-45f7-a75f-babdad3d8e17', 'cognito'), -- salman.mitha@nearform.com
('9a18b249-2ad6-4efa-87d5-49bfeaa90e86', '83156e3f-a075-43b5-b345-dacb06d5b057', 'cognito'), -- aneesa.ramzan@teamteach.co.uk
('b0326dc0-b5ff-4e39-8d1b-e9f3feed56ea', 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'cognito'), -- spyridon.chortis@nearform.com
('eaa21742-5657-4d97-911c-aacc9abc7bff', '99a03e41-f518-49a2-98cd-c77cb2e33483', 'cognito'), -- maksym.barvinskyi@nearform.com
('c2377ef9-4d9f-4321-b42a-b45115ce1e84', 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'cognito'), -- lefteris.paraskevas@nearform.com
('05211b74-5e28-4eb3-80eb-e903647afd96', '7eb8bd38-3048-4416-90d2-4b2299e4633b', 'cognito'), -- alex.parra@nearform.com
('2e1b9dd4-fec8-4496-8480-3dd41291fa88', '7584edda-3772-447c-9162-25f7fc6a9b38', 'cognito'), -- danijel.maksimovic@nearform.com
('f62ec818-cd85-4f56-afe7-d683d27468d3', '8fc963f5-1942-4e70-9107-7a84fe2e68d5', 'cognito'), -- piotr.piech@nearform.com
-- test users
('1491a65b-3237-45d4-a1de-7c70c0b139db', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com
('7d35e47b-2abf-40c5-8870-e638446eddbb', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'cognito'), -- trainer.with.org@teamteach.testinator.com
('71a0dafb-5183-47ec-aafc-a3872f27edc0', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'cognito'), -- trainer.and.user@teamteach.testinator.com
('65f12661-9338-4710-80a3-29bf8d5bba5c', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'cognito'), -- assistant@teamteach.testinator.com
('9272e68d-3c93-4556-9a54-d33852469107', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'cognito'), -- assistant.with.org@teamteach.testinator.com
('38c12252-a1aa-4b48-84c3-f723f353c33c', '6b72504a-6447-4b30-9909-e8e6fc1d300f', 'cognito'), -- user1@teamteach.testinator.com
('60dacac9-37f0-45e4-a9ac-8b1450fdba1f', 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', 'cognito'), -- user2@teamteach.testinator.com
('cb5932ea-d4ef-412a-a044-37afa09d3979', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'cognito'), -- user1.with.org@teamteach.testinator.com
('2c9a3eda-565a-4ccf-a9b7-c0cf8b9d362e', 'a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'cognito'), -- user2.with.org@teamteach.testinator.com
('b3b3c0c4-5963-4b3c-8104-a3d61bb80d8f', '22015a3e-8907-4333-8811-85f782265a63', 'cognito'), -- admin@teamteach.testinator.com
('71cea5c0-be31-468f-b569-571a33bfefd7', '48c9c19b-e7bf-4309-9679-52d5619d27dd', 'cognito'), -- ops@teamteach.testinator.com
('9b9275aa-f00f-411d-8ddd-451e9247ba39', '48812860-89a5-41be-95c9-b8889e88bffd', 'cognito'), -- moderator@teamteach.testinator.com
('79c0e73b-11d9-4e63-9964-7436a4cb5d35', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'cognito'), -- org.admin@teamteach.testinator.com
('26998788-367b-4bda-b13f-7dc0daf3f0f8', '8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'cognito'); -- password@teamteach.testinator.com

-- Adding all roles to all dev users
INSERT INTO profile_role (profile_id, role_id) SELECT '434de6da-cdc5-431b-b109-022854319d69', id FROM role; -- jonpaul.little@teamteach.co.uk
INSERT INTO profile_role (profile_id, role_id) SELECT '77eaddad-ba95-4ab7-9ef7-801b347d6502', id FROM role; -- andrew.winterbotham@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0', id FROM role; -- grzegorz.ilach@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT 'bb665826-8ff0-45f7-a75f-babdad3d8e17', id FROM role; -- salman.mitha@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '83156e3f-a075-43b5-b345-dacb06d5b057', id FROM role; -- aneesa.ramzan@teamteach.co.uk
INSERT INTO profile_role (profile_id, role_id) SELECT 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd', id FROM role; -- spyridon.chortis@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '99a03e41-f518-49a2-98cd-c77cb2e33483', id FROM role; -- maksym.barvinskyi@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', id FROM role; -- lefteris.paraskevas@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '7eb8bd38-3048-4416-90d2-4b2299e4633b', id FROM role; -- alex.parra@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '7584edda-3772-447c-9162-25f7fc6a9b38', id FROM role; -- danijel.maksimovic@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '8fc963f5-1942-4e70-9107-7a84fe2e68d5', id FROM role; -- piotr.piech@nearform.com

-- Adding roles to test users
INSERT INTO profile_role (profile_id, role_id) VALUES
('13a223a8-2184-42f1-ba37-b49e115e59a2', (SELECT id from role WHERE name = 'trainer')), -- trainer@teamteach.testinator.com
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', (SELECT id from role WHERE name = 'trainer')), -- trainer.with.org@teamteach.testinator.com
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', (SELECT id from role WHERE name = 'trainer')), -- trainer.and.user@teamteach.testinator.com
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', (SELECT id from role WHERE name = 'participant')),
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', (SELECT id from role WHERE name = 'trainer')), -- assistant@teamteach.testinator.com
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', (SELECT id from role WHERE name = 'trainer')), -- assistant.with.org@teamteach.testinator.com
('6b72504a-6447-4b30-9909-e8e6fc1d300f', (SELECT id from role WHERE name = 'participant')), -- user1@teamteach.testinator.com
('d394a9ff-7517-4e35-91aa-466f9d4c1b77', (SELECT id from role WHERE name = 'participant')), -- user2@teamteach.testinator.com
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', (SELECT id from role WHERE name = 'participant')), -- user1.with.org@teamteach.testinator.com
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', (SELECT id from role WHERE name = 'participant')), -- user2.with.org@teamteach.testinator.com
('22015a3e-8907-4333-8811-85f782265a63', (SELECT id from role WHERE name = 'tt-admin')), -- admin@teamteach.testinator.com
('48c9c19b-e7bf-4309-9679-52d5619d27dd', (SELECT id from role WHERE name = 'tt-ops')), -- ops@teamteach.testinator.com
('48812860-89a5-41be-95c9-b8889e88bffd', (SELECT id from role WHERE name = 'tt-ops')), -- moderator@teamteach.testinator.com
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', (SELECT id from role WHERE name = 'trainer')), -- org.admin@teamteach.testinator.com
('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', (SELECT id from role WHERE name = 'trainer')); -- password@teamteach.testinator.com

INSERT INTO organization (id, name, original_record) VALUES
('55320dc6-cfb0-41fb-9000-ca7eb9d2894d', 'NearForm', '{}'),
('c43b2ba0-8630-43e5-9558-f59ee9a224f0', 'London First School', '{}');

INSERT INTO organization_member (profile_id, organization_id) VALUES
('434de6da-cdc5-431b-b109-022854319d69', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- jonpaul.little@teamteach.co.uk
('77eaddad-ba95-4ab7-9ef7-801b347d6502', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- andrew.winterbotham@nearform.com
('fa65eb40-e964-481c-a42d-7c6c7a20c7b0', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- grzegorz.ilach@nearform.com
('bb665826-8ff0-45f7-a75f-babdad3d8e17', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- salman.mitha@nearform.com
('83156e3f-a075-43b5-b345-dacb06d5b057', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- aneesa.ramzan@teamteach.co.uk
('aa0302db-e4b4-4fb0-9b54-42082f57b0fd', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- spyridon.chortis@nearform.com
('99a03e41-f518-49a2-98cd-c77cb2e33483', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- maksym.barvinskyi@nearform.com
('ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- lefteris.paraskevas@nearform.com
('7eb8bd38-3048-4416-90d2-4b2299e4633b', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- alex.parra@nearform.com
('7584edda-3772-447c-9162-25f7fc6a9b38', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- danijel.maksimovic@nearform.com
('8fc963f5-1942-4e70-9107-7a84fe2e68d5', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- piotr.piech@nearform.com
-- test users
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- trainer.with.org@teamteach.testinator.com
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- assistant.with.org@teamteach.testinator.com
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- user1.with.org@teamteach.testinator.com
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'), -- user2.with.org@teamteach.testinator.com
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'c43b2ba0-8630-43e5-9558-f59ee9a224f0'); -- org.admin@teamteach.testinator.com
