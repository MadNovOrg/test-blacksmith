
alter table "public"."course_participant" drop constraint "course_participant_profile_id_fkey";
alter table "public"."course_participant" drop column "profile_id";

alter table "public"."course_participant" add column "contact_details" jsonb default '[]'::jsonb;
alter table "public"."course_participant" add column "last_name" text;
alter table "public"."course_participant" add column "first_name" text;
