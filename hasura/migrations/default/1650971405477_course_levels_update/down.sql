-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
UPDATE course_level SET name = 'INTERMEDIATE' WHERE name = 'INTERMEDIATE_TRAINER';
DELETE FROM course_level WHERE name = 'ADVANCED_TRAINER' OR name = 'BILD_ACT_TRAINER';
