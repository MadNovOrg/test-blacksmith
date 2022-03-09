
alter table "public"."course_participant" drop column "first_name" cascade;

alter table "public"."course_participant" drop column "last_name" cascade;

alter table "public"."course_participant" drop column "contact_details" cascade;

alter table "public"."course_participant" add column "profile_id" uuid
 not null;

alter table "public"."course_participant"
  add constraint "course_participant_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
