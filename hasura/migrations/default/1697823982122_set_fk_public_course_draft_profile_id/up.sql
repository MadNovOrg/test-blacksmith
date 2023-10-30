alter table "public"."course_draft"
  add constraint "course_draft_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update cascade on delete cascade;
