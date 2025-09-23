alter table "public"."course_evaluation_scheduled_event" drop constraint "course_evaluation_scheduled_event_profile_id_fkey",
  add constraint "course_evaluation_scheduled_event_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
