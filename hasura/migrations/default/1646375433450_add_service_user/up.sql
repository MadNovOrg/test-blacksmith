INSERT INTO profile (
  id,
  given_name, family_name, contact_details
) VALUES
('eb113192-3402-4729-9ca4-d546c677e07c', 'Service', 'User', '[ { "type": "email", "value": "service.user@teamteach.co.uk" } ]');

INSERT INTO identity (provider_id, profile_id, type) VALUES
(
  '399f1867-0ca2-4a48-b0b0-ca9067c55ad7',
  (SELECT id FROM profile WHERE contact_details @> '[{"value":"service.user@teamteach.co.uk"}]'  LIMIT 1),
  'cognito'
);

INSERT INTO role(id, name) VALUES ('df5cab47-f806-464b-b98f-4377e5e36534', 'service-user');

INSERT INTO profile_role(profile_id, role_id, _source) VALUES (
  'eb113192-3402-4729-9ca4-d546c677e07c',
  'df5cab47-f806-464b-b98f-4377e5e36534',
  'internal'
);
