INSERT INTO profile (
  given_name, family_name, contact_details
) VALUES 
('Shaun', 'Baker', '[ { "type": "email", "value": "shaun.baker@nearform.com" } ]'),
('Andrew', 'Winterbotham', '[ { "type": "email", "value": "andrew.winterbotham@nearform.com" } ]'),
('Greg', 'Ilach', '[ { "type": "email", "value": "grzegorz.ilach@nearform.com" } ]'),
('Salman', 'Mitha', '[ { "type": "email", "value": "salman.mitha@nearform.com" } ]'),
('Simone', 'Sanfratello', '[ { "type": "email", "value": "simone.sanfratello@nearform.com" } ]'),
('Spyridon', 'Chortis', '[ { "type": "email", "value": "spyridon.chortis@nearform.com" } ]'),
('Maksym', 'Barvinskyi', '[ { "type": "email", "value": "maksym.barvinskyi@nearform.com" } ]'),
('Lefteris', 'Paraskevas', '[ { "type": "email", "value": "lefteris.paraskevas@nearform.com" } ]');

INSERT INTO identity (provider_id, profile_id, type) VALUES 
(
  '9b0c754a-c12f-4f04-a554-cd899a09484d',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"shaun.baker@nearform.com"}]'),
  'cognito'
),
(
  '0d9f639e-1cd2-4a6b-a066-c693e573caa4',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"grzegorz.ilach@nearform.com"}]'),
  'cognito'
),
(
  'eff19c8c-5c44-412d-bbcf-d5f039aa2c97',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"salman.mitha@nearform.com"}]'),
  'cognito'
),
(
  '9a18b249-2ad6-4efa-87d5-49bfeaa90e86',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"simone.sanfratello@nearform.com"}]'),
  'cognito'
),
(
  'b0326dc0-b5ff-4e39-8d1b-e9f3feed56ea',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"spyridon.chortis@nearform.com"}]'),
  'cognito'
),
(
  '25ddb680-8dca-4c5d-925f-eb6824c2ab08',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"andrew.winterbotham@nearform.com"}]'),
  'cognito'
),
(
  'eaa21742-5657-4d97-911c-aacc9abc7bff',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"maksym.barvinskyi@nearform.com"}]'),
  'cognito'
),
(
  'c2377ef9-4d9f-4321-b42a-b45115ce1e84',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"lefteris.paraskevas@nearform.com"}]'),
  'cognito'
);
