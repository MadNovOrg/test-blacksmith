alter table "public"."course_participant_module" drop constraint "course_participant_module_course_participant_id_fkey",
  add constraint "course_participant_module_course_participant_id_fkey"
  foreign key ("course_participant_id")
  references "public"."course_participant"
  ("id") on update restrict on delete restrict;
