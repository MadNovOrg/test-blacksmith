
alter table "public"."course" add column "contact_profile_id" uuid
 null;

alter table "public"."course"
  add constraint "course_contact_profile_id_fkey"
  foreign key ("contact_profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
