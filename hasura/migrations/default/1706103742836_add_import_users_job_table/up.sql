CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."import_users_job" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
  "result" jsonb NOT NULL, 
  PRIMARY KEY ("id") );
  
COMMENT ON TABLE "public"."import_users_job" IS E'Tracks an import user job';

CREATE TABLE "public"."import_users_job_status" (
  "name" text NOT NULL, PRIMARY KEY ("name") );
  
COMMENT ON TABLE "public"."import_users_job_status" IS E'Enum table of import users job status';

INSERT INTO import_users_job_status(name)
VALUES ('IN_PROGRESS'), ('FAILED'), ('SUCCEEDED');

alter table "public"."import_users_job" add column "status" text
 null;

ALTER TABLE "public"."import_users_job"
  ADD CONSTRAINT "import_users_job_status_fkey"
  FOREIGN KEY ("status")
  REFERENCES "public"."import_users_job_status"
  ("name") ON UPDATE cascade ON DELETE SET DEFAULT;
