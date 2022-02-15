INSERT INTO profile (
  id,
  given_name, family_name, contact_details
) VALUES
('434de6da-cdc5-431b-b109-022854319d69', 'Shaun', 'Baker', '[ { "type": "email", "value": "shaun.baker@nearform.com" } ]'),
('77eaddad-ba95-4ab7-9ef7-801b347d6502', 'Andrew', 'Winterbotham', '[ { "type": "email", "value": "andrew.winterbotham@nearform.com" } ]'),
('fa65eb40-e964-481c-a42d-7c6c7a20c7b0', 'Greg', 'Ilach', '[ { "type": "email", "value": "grzegorz.ilach@nearform.com" } ]'),
('bb665826-8ff0-45f7-a75f-babdad3d8e17', 'Salman', 'Mitha', '[ { "type": "email", "value": "salman.mitha@nearform.com" } ]'),
('83156e3f-a075-43b5-b345-dacb06d5b057', 'Simone', 'Sanfratello', '[ { "type": "email", "value": "simone.sanfratello@nearform.com" } ]'),
('aa0302db-e4b4-4fb0-9b54-42082f57b0fd', 'Spyridon', 'Chortis', '[ { "type": "email", "value": "spyridon.chortis@nearform.com" } ]'),
('99a03e41-f518-49a2-98cd-c77cb2e33483', 'Maksym', 'Barvinskyi', '[ { "type": "email", "value": "maksym.barvinskyi@nearform.com" } ]'),
('ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b', 'Lefteris', 'Paraskevas', '[ { "type": "email", "value": "lefteris.paraskevas@nearform.com" } ]'),
('7eb8bd38-3048-4416-90d2-4b2299e4633b', 'Alex', 'Parra', '[ { "type": "email", "value": "alex.parra@nearform.com" } ]');

INSERT INTO identity (provider_id, profile_id, type) VALUES
(
  '9b0c754a-c12f-4f04-a554-cd899a09484d',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"shaun.baker@nearform.com"}]'  LIMIT 1),
  'cognito'
),
(
  '0d9f639e-1cd2-4a6b-a066-c693e573caa4',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"grzegorz.ilach@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  'eff19c8c-5c44-412d-bbcf-d5f039aa2c97',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"salman.mitha@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  '9a18b249-2ad6-4efa-87d5-49bfeaa90e86',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"simone.sanfratello@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  'b0326dc0-b5ff-4e39-8d1b-e9f3feed56ea',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"spyridon.chortis@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  '25ddb680-8dca-4c5d-925f-eb6824c2ab08',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"andrew.winterbotham@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  'eaa21742-5657-4d97-911c-aacc9abc7bff',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"maksym.barvinskyi@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  'c2377ef9-4d9f-4321-b42a-b45115ce1e84',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"lefteris.paraskevas@nearform.com"}]' LIMIT 1),
  'cognito'
),
(
  '05211b74-5e28-4eb3-80eb-e903647afd96',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"alex.parra@nearform.com"}]' LIMIT 1),
  'cognito'
);

INSERT INTO organization (id, name, original_record) VALUES ('55320dc6-cfb0-41fb-9000-ca7eb9d2894d', 'NearForm', '{}');

INSERT INTO organization_member (profile_id, organization_id) VALUES (
  '434de6da-cdc5-431b-b109-022854319d69',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  '77eaddad-ba95-4ab7-9ef7-801b347d6502',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  'fa65eb40-e964-481c-a42d-7c6c7a20c7b0',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  'bb665826-8ff0-45f7-a75f-babdad3d8e17',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  '83156e3f-a075-43b5-b345-dacb06d5b057',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  'aa0302db-e4b4-4fb0-9b54-42082f57b0fd',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  '99a03e41-f518-49a2-98cd-c77cb2e33483',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
), (
  '7eb8bd38-3048-4416-90d2-4b2299e4633b',
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d'
);

INSERT INTO role(name) VALUES ('Administrator') ON CONFLICT DO NOTHING;

INSERT INTO organization_role(organization_id, role_id) VALUES (
  '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
  (SELECT id FROM role WHERE name = 'Administrator')
);

INSERT INTO organization_member_role(organization_member_id, organization_role_id) VALUES (
  (SELECT id FROM organization_member WHERE profile_id = '434de6da-cdc5-431b-b109-022854319d69' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = '77eaddad-ba95-4ab7-9ef7-801b347d6502' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = 'fa65eb40-e964-481c-a42d-7c6c7a20c7b0' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = 'bb665826-8ff0-45f7-a75f-babdad3d8e17' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = '83156e3f-a075-43b5-b345-dacb06d5b057' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = 'aa0302db-e4b4-4fb0-9b54-42082f57b0fd' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = '99a03e41-f518-49a2-98cd-c77cb2e33483' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = 'ab5dc61d-dafa-45a9-abc7-e0d1663f2c3b' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
), (
  (SELECT id FROM organization_member WHERE profile_id = '7eb8bd38-3048-4416-90d2-4b2299e4633b' LIMIT 1),
  (SELECT id FROM organization_role WHERE organization_id = '55320dc6-cfb0-41fb-9000-ca7eb9d2894d' LIMIT 1)
);
