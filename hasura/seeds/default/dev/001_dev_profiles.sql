INSERT INTO profile (id, given_name, family_name, email) VALUES
('434de6da-cdc5-431b-b109-022854319d69', 'Jon-Paul', 'Little', 'jonpaul.little@teamteach.co.uk'),
('77eaddad-ba95-4ab7-9ef7-801b347d6502', 'Andrew', 'Winterbotham', 'andrew.winterbotham@nearform.com'),
('fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'Greg', 'Ilach', 'grzegorz.ilach@nearform.com'),
('bb665826-8ff0-45f7-a75f-babdad3d8e17', 'Salman', 'Mitha', 'salman.mitha@nearform.com'),
('83156e3f-a075-43b5-b345-dacb06d5b057', 'Aneesa', 'Ramzan', 'aneesa.ramzan@teamteach.co.uk'),
('aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'Spyridon', 'Chortis', 'spyridon.chortis@nearform.com'),
('99a03e41-f518-49a2-98cd-c77cb2e33483', 'Maksym', 'Barvinskyi', 'maksym.barvinskyi@nearform.com'),
('ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'Lefteris', 'Paraskevas', 'lefteris.paraskevas@nearform.com'),
('7eb8bd38-3048-4416-90d2-4b2299e4633b', 'Alex', 'Parra', 'alex.parra@nearform.com'),
('7584edda-3772-447c-9162-25f7fc6a9b38', 'Danijel', 'Maksimovic', 'danijel.maksimovic@nearform.com'),
('8fc963f5-1942-4e70-9107-7a84fe2e68d5', 'Piotr', 'Piech', 'piotr.piech@nearform.com'),
-- test users
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'John', 'Trainer', 'trainer@teamteach.testinator.com'),
('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'Mark', 'Trainer', 'trainer.with.org@teamteach.testinator.com'),
('bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'Steven', 'Trainer', 'trainer.and.user@teamteach.testinator.com'),
('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'Liam', 'Assistant', 'assistant@teamteach.testinator.com'),
('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'Noah', 'Assistant', 'assistant.with.org@teamteach.testinator.com'),
('6b72504a-6447-4b30-9909-e8e6fc1d300f', 'Oliver', 'Participant', 'user1@teamteach.testinator.com'),
('d394a9ff-7517-4e35-91aa-466f9d4c1b77', 'Elijah', 'Participant', 'user2@teamteach.testinator.com'),
('fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'William', 'Participant', 'user1.with.org@teamteach.testinator.com'),
('a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'James', 'Participant', 'user2.with.org@teamteach.testinator.com'),
('22015a3e-8907-4333-8811-85f782265a63', 'Benjamin', 'Admin', 'admin@teamteach.testinator.com'),
('48c9c19b-e7bf-4309-9679-52d5619d27dd', 'Lucas', 'Ops', 'ops@teamteach.testinator.com'),
('48812860-89a5-41be-95c9-b8889e88bffd', 'Henry', 'Moderator', 'moderator@teamteach.testinator.com'),
('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'Alex', 'Admin', 'org.admin@teamteach.testinator.com'),
('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'Logan', 'Password', 'password@teamteach.testinator.com');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('5b01499b-b0f6-4d2f-81a6-20d17581f888', '434de6da-cdc5-431b-b109-022854319d69', 'cognito'), -- jonpaul.little@teamteach.co.uk
('f0a23d6a-fcea-43fd-b418-ce138ed3bd1a', '77eaddad-ba95-4ab7-9ef7-801b347d6502', 'cognito'), -- andrew.winterbotham@nearform.com
('740b9591-757a-44d2-ade5-35c70ed76cdf', 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'cognito'), -- grzegorz.ilach@nearform.com
('4b3bd6d5-5f58-4dee-adfe-3ed1838c7b64', 'bb665826-8ff0-45f7-a75f-babdad3d8e17', 'cognito'), -- salman.mitha@nearform.com
('2bc05586-55fb-4f3f-b9a5-64ed8cdaed61', '83156e3f-a075-43b5-b345-dacb06d5b057', 'cognito'), -- aneesa.ramzan@teamteach.co.uk
('323da9cb-e3fc-4eef-9bcc-716ffbe41d1a', 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'cognito'), -- spyridon.chortis@nearform.com
('07c545cc-3c1d-4b2c-bb6f-632ac7a1d91f', '99a03e41-f518-49a2-98cd-c77cb2e33483', 'cognito'), -- maksym.barvinskyi@nearform.com
('51ad2627-cd6f-4b1d-ad98-44de733c7ba8', 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'cognito'), -- lefteris.paraskevas@nearform.com
('6392f477-ce2f-4408-b80d-37e237b9aa11', '7eb8bd38-3048-4416-90d2-4b2299e4633b', 'cognito'), -- alex.parra@nearform.com
('22b8b110-a559-472a-84ca-d92880044315', '7584edda-3772-447c-9162-25f7fc6a9b38', 'cognito'), -- danijel.maksimovic@nearform.com
('483ae253-c815-4f63-bf40-5c2173f5ca23', '8fc963f5-1942-4e70-9107-7a84fe2e68d5', 'cognito'), -- piotr.piech@nearform.com
-- test users
('fa021939-81e5-4101-8f8b-c02d28b127be', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com
('49f998c9-dfc7-4a02-8de1-2207a1bd93d9', '5c6434fd-d4ee-47f5-8200-0d7b767e2e95', 'cognito'), -- trainer.with.org@teamteach.testinator.com
('d96bafb4-5605-4029-99b9-792702727519', 'bb5526c7-198c-4be5-a53a-1177f55c1c5b', 'cognito'), -- trainer.and.user@teamteach.testinator.com
('f741910a-7680-4082-8910-99b7bbf807eb', '4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', 'cognito'), -- assistant@teamteach.testinator.com
('df720183-c8e6-4f29-ac96-4e443eec0550', 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', 'cognito'), -- assistant.with.org@teamteach.testinator.com
('3e904cc3-c091-4cb6-90c9-c7aece4558a9', '6b72504a-6447-4b30-9909-e8e6fc1d300f', 'cognito'), -- user1@teamteach.testinator.com
('828d9bac-bb11-4d54-ad52-41f8e04d49a6', 'd394a9ff-7517-4e35-91aa-466f9d4c1b77', 'cognito'), -- user2@teamteach.testinator.com
('9201c823-8380-46c5-a618-47d0abe2d9ae', 'fb523ef0-7fd1-42b2-b078-dce29a1713fe', 'cognito'), -- user1.with.org@teamteach.testinator.com
('fa6d5346-465a-4b34-8294-a4a5e256ee5c', 'a39bb4b3-a07a-4610-8da1-b0ce885cc263', 'cognito'), -- user2.with.org@teamteach.testinator.com
('8ca1d482-7e20-4448-8eb6-946550e01b1e', '22015a3e-8907-4333-8811-85f782265a63', 'cognito'), -- admin@teamteach.testinator.com
('f04574f6-893f-4ff0-bae5-8cd58ea9e065', '48c9c19b-e7bf-4309-9679-52d5619d27dd', 'cognito'), -- ops@teamteach.testinator.com
('a33cc575-1642-4435-87bf-21edaebb52e9', '48812860-89a5-41be-95c9-b8889e88bffd', 'cognito'), -- moderator@teamteach.testinator.com
('99ac246d-1b0a-4075-bff6-1550330c5ea8', 'ed8826a3-6cf4-4631-8b47-5d80b7a574fa', 'cognito'), -- org.admin@teamteach.testinator.com
('9e148a44-ee2f-446d-a188-da5dfdb0f6ac', '8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', 'cognito'); -- password@teamteach.testinator.com

-- Skipping adding any roles until roles functionality is implemented
-- Adding all roles to all dev users
-- INSERT INTO profile_role (profile_id, role_id) SELECT '434de6da-cdc5-431b-b109-022854319d69', id FROM role; -- jonpaul.little@teamteach.co.uk
-- INSERT INTO profile_role (profile_id, role_id) SELECT '77eaddad-ba95-4ab7-9ef7-801b347d6502', id FROM role; -- andrew.winterbotham@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0', id FROM role; -- grzegorz.ilach@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT 'bb665826-8ff0-45f7-a75f-babdad3d8e17', id FROM role; -- salman.mitha@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT '83156e3f-a075-43b5-b345-dacb06d5b057', id FROM role; -- aneesa.ramzan@teamteach.co.uk
-- INSERT INTO profile_role (profile_id, role_id) SELECT 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd', id FROM role; -- spyridon.chortis@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT '99a03e41-f518-49a2-98cd-c77cb2e33483', id FROM role; -- maksym.barvinskyi@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', id FROM role; -- lefteris.paraskevas@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT '7eb8bd38-3048-4416-90d2-4b2299e4633b', id FROM role; -- alex.parra@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT '7584edda-3772-447c-9162-25f7fc6a9b38', id FROM role; -- danijel.maksimovic@nearform.com
-- INSERT INTO profile_role (profile_id, role_id) SELECT '8fc963f5-1942-4e70-9107-7a84fe2e68d5', id FROM role; -- piotr.piech@nearform.com

-- Adding roles to test users
-- INSERT INTO profile_role (profile_id, role_id) VALUES
-- ('13a223a8-2184-42f1-ba37-b49e115e59a2', (SELECT id from role WHERE name = 'trainer')), -- trainer@teamteach.testinator.com
-- ('5c6434fd-d4ee-47f5-8200-0d7b767e2e95', (SELECT id from role WHERE name = 'trainer')), -- trainer.with.org@teamteach.testinator.com
-- ('bb5526c7-198c-4be5-a53a-1177f55c1c5b', (SELECT id from role WHERE name = 'trainer')), -- trainer.and.user@teamteach.testinator.com
-- ('bb5526c7-198c-4be5-a53a-1177f55c1c5b', (SELECT id from role WHERE name = 'participant')),
-- ('4d43e8b0-1143-4cfa-bbb7-bac97e76ddf5', (SELECT id from role WHERE name = 'trainer')), -- assistant@teamteach.testinator.com
-- ('b9b0eb9f-374c-4d39-9370-a8e8cdc90d25', (SELECT id from role WHERE name = 'trainer')), -- assistant.with.org@teamteach.testinator.com
-- ('6b72504a-6447-4b30-9909-e8e6fc1d300f', (SELECT id from role WHERE name = 'participant')), -- user1@teamteach.testinator.com
-- ('d394a9ff-7517-4e35-91aa-466f9d4c1b77', (SELECT id from role WHERE name = 'participant')), -- user2@teamteach.testinator.com
-- ('fb523ef0-7fd1-42b2-b078-dce29a1713fe', (SELECT id from role WHERE name = 'participant')), -- user1.with.org@teamteach.testinator.com
-- ('a39bb4b3-a07a-4610-8da1-b0ce885cc263', (SELECT id from role WHERE name = 'participant')), -- user2.with.org@teamteach.testinator.com
-- ('22015a3e-8907-4333-8811-85f782265a63', (SELECT id from role WHERE name = 'tt-admin')), -- admin@teamteach.testinator.com
-- ('48c9c19b-e7bf-4309-9679-52d5619d27dd', (SELECT id from role WHERE name = 'tt-ops')), -- ops@teamteach.testinator.com
-- ('48812860-89a5-41be-95c9-b8889e88bffd', (SELECT id from role WHERE name = 'tt-ops')), -- moderator@teamteach.testinator.com
-- ('ed8826a3-6cf4-4631-8b47-5d80b7a574fa', (SELECT id from role WHERE name = 'trainer')), -- org.admin@teamteach.testinator.com
-- ('8ee0d91a-8573-4a4c-91c2-afa1a2ed49e2', (SELECT id from role WHERE name = 'trainer')); -- password@teamteach.testinator.com

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
