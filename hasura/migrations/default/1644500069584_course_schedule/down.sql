
alter table "public"."course_team" drop constraint "course_team_course_id_fkey";

alter table "public"."course_team" drop constraint "course_team_profile_id_fkey";

DROP TABLE "public"."course_team";

alter table "public"."course_participant" drop constraint "course_participant_course_id_fkey";

DROP TABLE "public"."course_participant";


alter table "public"."course_schedule" drop constraint "course_schedule_type_fkey";

alter table "public"."course_schedule" drop constraint "course_schedule_venue_id_fkey";

alter table "public"."course_schedule" drop constraint "course_schedule_course_id_fkey";

DROP TABLE "public"."course_schedule";
