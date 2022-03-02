
alter table "public"."course" add column "trainer_profile_id" uuid
 null;

alter table "public"."course"
  add constraint "course_trainer_profile_id_fkey"
  foreign key ("trainer_profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
