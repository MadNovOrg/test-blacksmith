
alter table "public"."course" add column "organization_key_contact_invite_data" jsonb
 null;

alter table "public"."course" add column "organization_key_contact_profile_id" uuid
 null;

INSERT INTO "public"."role"("name", "rank", "data", "id") VALUES (E'organization-key-contact', null, '{}', E'ee233028-6270-4cc4-b5c6-07e4c482fe07');

alter table "public"."course"
  add constraint "course_organization_key_contact_profile_id_fkey"
  foreign key ("organization_key_contact_profile_id")
  references "public"."profile"
  ("id") on update restrict on delete set null;
