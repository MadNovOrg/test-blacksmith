alter table "public"."course_participant" drop constraint "course_participant_certificate_id_fkey",
  add constraint "course_participant_certificate_id_fkey"
  foreign key ("certificate_id")
  references "public"."course_certificate"
  ("id") on update no action on delete set null;
