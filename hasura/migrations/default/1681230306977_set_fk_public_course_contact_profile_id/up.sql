alter table "public"."course" drop constraint "course_contact_profile_id_fkey",
  add constraint "course_contact_profile_id_fkey"
  foreign key ("contact_profile_id")
  references "public"."profile"
  ("id") on update restrict on delete set null;
