alter table "public"."course_schedule" add column "name" text;
alter table "public"."course_schedule" add column "type" text;

alter table "public"."course_schedule"
  add constraint "course_schedule_type_fkey"
  foreign key (type)
  references "public"."module_medium"
  (name) on update restrict on delete restrict;

