DELETE FROM profile_role
WHERE profile_id = 'eb113192-3402-4729-9ca4-d546c677e07c'
  AND role_id = 'df5cab47-f806-464b-b98f-4377e5e36534';

DELETE FROM role WHERE name = 'service-user';

DELETE FROM identity WHERE provider_id = '399f1867-0ca2-4a48-b0b0-ca9067c55ad7';

DELETE FROM profile WHERE id = 'eb113192-3402-4729-9ca4-d546c677e07c';
