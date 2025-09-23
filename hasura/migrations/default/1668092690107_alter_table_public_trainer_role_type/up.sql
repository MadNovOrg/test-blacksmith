
INSERT INTO trainer_role_type(name) VALUES 
('moderator'), 
('trainer-eta'), 
('aol-eta');

DELETE FROM "public"."trainer_role_type" WHERE "name" = 'eta';
