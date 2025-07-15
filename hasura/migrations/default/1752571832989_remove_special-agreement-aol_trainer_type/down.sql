INSERT INTO trainer_role_type (name)
SELECT 'special-agreement-aol'
WHERE NOT EXISTS (
  SELECT 1 FROM trainer_role_type WHERE name = 'special-agreement-aol'
);