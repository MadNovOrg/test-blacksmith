
alter table "public"."course" add column "source" text
 null;

alter table "public"."course"
  add constraint "course_source_fkey"
  foreign key ("source")
  references "public"."course_source"
  ("name") on update cascade on delete set null;
