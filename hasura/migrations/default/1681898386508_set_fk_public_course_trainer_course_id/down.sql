alter table "public"."course_trainer" drop constraint "course_trainer_course_id_fkey",
  add constraint "course_leader_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update no action on delete cascade;
