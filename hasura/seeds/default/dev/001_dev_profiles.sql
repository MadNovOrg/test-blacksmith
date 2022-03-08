INSERT INTO profile (id, given_name, family_name, contact_details) VALUES
('434de6da-cdc5-431b-b109-022854319d69', 'Jon-Paul', 'Little', '[ { "type": "email", "value": "jonpaul.little@teamteach.co.uk" } ]'),
('77eaddad-ba95-4ab7-9ef7-801b347d6502', 'Andrew', 'Winterbotham', '[ { "type": "email", "value": "andrew.winterbotham@nearform.com" } ]'),
('fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'Greg', 'Ilach', '[ { "type": "email", "value": "grzegorz.ilach@nearform.com" } ]'),
('bb665826-8ff0-45f7-a75f-babdad3d8e17', 'Salman', 'Mitha', '[ { "type": "email", "value": "salman.mitha@nearform.com" } ]'),
('83156e3f-a075-43b5-b345-dacb06d5b057', 'Aneesa', 'Ramzan', '[ { "type": "email", "value": "aneesa.ramzan@teamteach.co.uk" } ]'),
('aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'Spyridon', 'Chortis', '[ { "type": "email", "value": "spyridon.chortis@nearform.com" } ]'),
('99a03e41-f518-49a2-98cd-c77cb2e33483', 'Maksym', 'Barvinskyi', '[ { "type": "email", "value": "maksym.barvinskyi@nearform.com" } ]'),
('13a223a8-2184-42f1-ba37-b49e115e59a2', 'John', 'Trainer', '[ { "type": "email", "value": "trainer@teamteach.testinator.com" } ]'),
('ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'Lefteris', 'Paraskevas', '[ { "type": "email", "value": "lefteris.paraskevas@nearform.com" } ]'),
('7eb8bd38-3048-4416-90d2-4b2299e4633b', 'Alex', 'Parra', '[ { "type": "email", "value": "alex.parra@nearform.com" } ]'),
('7584edda-3772-447c-9162-25f7fc6a9b38', 'Danijel', 'Maksimovic', '[ { "type": "email", "value": "danijel.maksimovic@nearform.com" } ]'),
('8fc963f5-1942-4e70-9107-7a84fe2e68d5', 'Piotr', 'Piech', '[ { "type": "email", "value": "piotr.piech@nearform.com" } ]');

INSERT INTO identity (provider_id, profile_id, type) VALUES
('9b0c754a-c12f-4f04-a554-cd899a09484d', '434de6da-cdc5-431b-b109-022854319d69', 'cognito'), -- jonpaul.little@teamteach.co.uk
('25ddb680-8dca-4c5d-925f-eb6824c2ab08', '77eaddad-ba95-4ab7-9ef7-801b347d6502', 'cognito'), -- andrew.winterbotham@nearform.com
('0d9f639e-1cd2-4a6b-a066-c693e573caa4', 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'cognito'), -- grzegorz.ilach@nearform.com
('eff19c8c-5c44-412d-bbcf-d5f039aa2c97', 'bb665826-8ff0-45f7-a75f-babdad3d8e17', 'cognito'), -- salman.mitha@nearform.com
('9a18b249-2ad6-4efa-87d5-49bfeaa90e86', '83156e3f-a075-43b5-b345-dacb06d5b057', 'cognito'), -- aneesa.ramzan@teamteach.co.uk
('b0326dc0-b5ff-4e39-8d1b-e9f3feed56ea', 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'cognito'), -- spyridon.chortis@nearform.com
('eaa21742-5657-4d97-911c-aacc9abc7bff', '99a03e41-f518-49a2-98cd-c77cb2e33483', 'cognito'), -- maksym.barvinskyi@nearform.com
('1491a65b-3237-45d4-a1de-7c70c0b139db', '13a223a8-2184-42f1-ba37-b49e115e59a2', 'cognito'), -- trainer@teamteach.testinator.com
('c2377ef9-4d9f-4321-b42a-b45115ce1e84', 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'cognito'), -- lefteris.paraskevas@nearform.com
('05211b74-5e28-4eb3-80eb-e903647afd96', '7eb8bd38-3048-4416-90d2-4b2299e4633b', 'cognito'), -- alex.parra@nearform.com
('2e1b9dd4-fec8-4496-8480-3dd41291fa88', '7584edda-3772-447c-9162-25f7fc6a9b38', 'cognito'), -- danijel.maksimovic@nearform.com
('f62ec818-cd85-4f56-afe7-d683d27468d3', '8fc963f5-1942-4e70-9107-7a84fe2e68d5', 'cognito'); -- piotr.piech@nearform.com

-- Adding all roles to all dev users
INSERT INTO profile_role (profile_id, role_id) SELECT '434de6da-cdc5-431b-b109-022854319d69', id FROM role; -- jonpaul.little@teamteach.co.uk
INSERT INTO profile_role (profile_id, role_id) SELECT '77eaddad-ba95-4ab7-9ef7-801b347d6502', id FROM role; -- andrew.winterbotham@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0', id FROM role; -- grzegorz.ilach@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT 'bb665826-8ff0-45f7-a75f-babdad3d8e17', id FROM role; -- salman.mitha@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '83156e3f-a075-43b5-b345-dacb06d5b057', id FROM role; -- aneesa.ramzan@teamteach.co.uk
INSERT INTO profile_role (profile_id, role_id) SELECT 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd', id FROM role; -- spyridon.chortis@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '99a03e41-f518-49a2-98cd-c77cb2e33483', id FROM role; -- maksym.barvinskyi@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '13a223a8-2184-42f1-ba37-b49e115e59a2', id FROM role; -- trainer@teamteach.testinator.com
INSERT INTO profile_role (profile_id, role_id) SELECT 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', id FROM role; -- lefteris.paraskevas@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '7eb8bd38-3048-4416-90d2-4b2299e4633b', id FROM role; -- alex.parra@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '7584edda-3772-447c-9162-25f7fc6a9b38', id FROM role; -- danijel.maksimovic@nearform.com
INSERT INTO profile_role (profile_id, role_id) SELECT '8fc963f5-1942-4e70-9107-7a84fe2e68d5', id FROM role; -- piotr.piech@nearform.com

INSERT INTO organization (id, name, original_record) VALUES
('55320dc6-cfb0-41fb-9000-ca7eb9d2894d', 'NearForm', '{}');

INSERT INTO organization_member (profile_id, organization_id) VALUES
('434de6da-cdc5-431b-b109-022854319d69', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- jonpaul.little@teamteach.co.uk
('77eaddad-ba95-4ab7-9ef7-801b347d6502', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- andrew.winterbotham@nearform.com
('fa65eb40-e964-481c-a42d-7c6c7a20c7b0', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- grzegorz.ilach@nearform.com
('bb665826-8ff0-45f7-a75f-babdad3d8e17', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- salman.mitha@nearform.com
('83156e3f-a075-43b5-b345-dacb06d5b057', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- aneesa.ramzan@teamteach.co.uk
('aa0302db-e4b4-4fb0-9b54-42082f57b0fd', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- spyridon.chortis@nearform.com
('99a03e41-f518-49a2-98cd-c77cb2e33483', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- maksym.barvinskyi@nearform.com
('13a223a8-2184-42f1-ba37-b49e115e59a2', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- trainer@teamteach.testinator.com
('ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- lefteris.paraskevas@nearform.com
('7eb8bd38-3048-4416-90d2-4b2299e4633b', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- alex.parra@nearform.com
('7584edda-3772-447c-9162-25f7fc6a9b38', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'), -- danijel.maksimovic@nearform.com
('8fc963f5-1942-4e70-9107-7a84fe2e68d5', '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'); -- piotr.piech@nearform.com
