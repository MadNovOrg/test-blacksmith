
alter table "public"."course" drop constraint "course_trainer_profile_id_fkey";
alter table "public"."course" drop column "trainer_profile_id";
