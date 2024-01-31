-- Remove the 'data' column
alter table "public"."import_users_job"
drop column "data";

-- Remove the 'config' column
alter table "public"."import_users_job"
drop column "config";

-- Remove the 'started_by' column
alter table "public"."import_users_job"
drop column "started_by";

-- Remove the 'started_on' column
alter table "public"."import_users_job"
drop column "started_on";

-- Remove the 'finished_on' column
alter table "public"."import_users_job"
drop column "finished_on";

-- Remove the 'PARTIALLY_SUCCEEDED' status
DELETE FROM import_users_job_status
WHERE name = 'PARTIALLY_SUCCEEDED';
