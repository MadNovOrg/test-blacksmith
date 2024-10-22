
comment on table "public"."import_job" is NULL;

ALTER TABLE "public"."import_job" DROP COLUMN "type";

DELETE FROM "public"."import_job_type" WHERE "name" = 'ORGANISATIONS';

DELETE FROM "public"."import_job_type" WHERE "name" = 'USERS';

DROP TABLE "public"."import_job_type";

alter table "public"."import_job_status" rename to "import_users_job_status";

alter table "public"."import_job" rename to "import_users_job";
