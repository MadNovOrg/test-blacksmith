alter table "public"."course_evaluation_scheduled_event" drop constraint "course_evaluation_scheduled_event_course_id_fkey",
  add constraint "course_evaluation_scheduled_event_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update cascade on delete cascade;
