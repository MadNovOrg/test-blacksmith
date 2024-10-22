
alter table "public"."import_users_job" rename to "import_job";

alter table "public"."import_users_job_status" rename to "import_job_status";

CREATE TABLE "public"."import_job_type" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."import_job_type"("name") VALUES (E'USERS');

INSERT INTO "public"."import_job_type"("name") VALUES (E'ORGANISATIONS');

alter table "public"."import_job" add column "type" text;
comment on table "public"."import_job" is E'Tracks an import job';
