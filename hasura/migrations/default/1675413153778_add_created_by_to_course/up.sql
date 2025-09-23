
alter table "public"."course" add column "created_by_id" uuid
 null;

alter table "public"."course"
  add constraint "course_created_by_id_fkey"
  foreign key ("created_by_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
