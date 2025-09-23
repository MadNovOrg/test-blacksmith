
CREATE TABLE "public"."course_type_prefix" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "prefix" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("name"), UNIQUE ("prefix"));COMMENT ON TABLE "public"."course_type_prefix" IS E'Course types with their prefixes (used to generate course codes)';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO course_type_prefix(name, prefix) VALUES ('OPEN', 'OP'), ('CLOSED', 'CL'), ('INDIRECT', 'INDR');
