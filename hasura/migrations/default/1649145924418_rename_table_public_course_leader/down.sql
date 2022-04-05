DROP FUNCTION IF EXISTS course_lead_trainer(course_row course);

DROP INDEX "public"."course_trainer_unique_leader";

alter table "public"."course_trainer" drop constraint "course_trainer_course_id_profile_id_key";

alter table "public"."course_trainer" rename to "course_leader";

alter table "public"."course" add column "trainer_profile_id" uuid null;

alter table "public"."course"
  add constraint "course_trainer_profile_id_fkey"
  foreign key ("trainer_profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;

alter table "public"."profile_role" drop constraint "profile_role_role_id_fkey",
  add constraint "profile_role_role_id_fkey"
  foreign key ("role_id")
  references "public"."role"
  ("id") on update no action on delete cascade;
