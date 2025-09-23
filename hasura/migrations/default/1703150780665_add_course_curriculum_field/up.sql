
alter table "public"."course" add column "curriculum" jsonb
 null;

alter table "public"."course_participant" add column "graded_on" jsonb
 null;
