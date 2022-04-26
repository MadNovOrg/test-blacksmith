alter table "public"."profile_temp"
  add constraint "profile_temp_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update restrict on delete restrict;
