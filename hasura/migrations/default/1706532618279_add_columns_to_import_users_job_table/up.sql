
alter table "public"."import_users_job" add column "data" text null;

alter table "public"."import_users_job" add column "config" jsonb null;

alter table "public"."import_users_job" add column "started_by" uuid null;

alter table "public"."import_users_job" add column "started_on" timestamp
 not null default now();

alter table "public"."import_users_job" add column "finished_on" timestamp
 null;

INSERT INTO import_users_job_status(name)
VALUES ('PARTIALLY_SUCCEEDED');
