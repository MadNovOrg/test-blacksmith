
UPDATE course_type SET name = LOWER(name);

alter table "public"."course" drop constraint "course_course_type_fkey",
  add constraint "course_course_type_fkey"
  foreign key ("course_type")
  references "public"."course_type"
  ("name") on update no action on delete restrict;
