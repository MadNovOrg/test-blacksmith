alter table "public"."course_participant" drop constraint "course_participant_invite_id_fkey";

alter table "public"."course_participant" drop column "invite_id";