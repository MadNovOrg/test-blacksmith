-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."course_participant" add column "date_graded" timestamptz
--  null;
alter table "public"."course_participant" drop column "date_graded";
