
CREATE TABLE "public"."trainer_role_type" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("name"));COMMENT ON TABLE "public"."trainer_role_type" IS E'Trainer role types';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO trainer_role_type(name) VALUES 
('principal'), 
('senior'), 
('senior-assist'),
('employer-trainer'),
('eta'),
('bild-senior'),
('bild-certified'),
('employer-aol'),
('special-agreement-aol');
