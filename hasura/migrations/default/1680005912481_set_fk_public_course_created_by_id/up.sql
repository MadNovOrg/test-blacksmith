alter table "public"."course" drop constraint "course_created_by_id_fkey",
  add constraint "course_created_by_id_fkey"
  foreign key ("created_by_id")
  references "public"."profile"
  ("id") on update restrict on delete set null;
