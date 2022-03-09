alter table "public"."course_participant" add column "organization_id" uuid;
alter table "public"."course_participant"
  add constraint "course_participant_organization_id_fkey"
  foreign key (organization_id)
  references "public"."organization"
  (id) on update restrict on delete restrict;
