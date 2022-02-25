
alter table "public"."course" drop constraint "course_course_type_fkey",
  add constraint "course_course_type_fkey"
  foreign key ("course_type")
  references "public"."course_type"
  ("name") on update cascade on delete restrict;

UPDATE course_type SET name = UPPER(name);
