
CREATE TABLE "public"."course_level_prefix" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "prefix" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("name"), UNIQUE ("prefix"));COMMENT ON TABLE "public"."course_level_prefix" IS E'Course levels with their prefixes (used to generate course codes)';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO course_level_prefix(name, prefix) VALUES 
('LEVEL_1', 'L1'), 
('LEVEL_2', 'L2'), 
('ADVANCED', 'ADV'), 
('BILD_ACT', 'ACT'), 
('INTERMEDIATE_TRAINER', 'INT-T'), 
('ADVANCED_TRAINER', 'ADV-T'), 
('BILD_ACT_TRAINER', 'ACT-T');
