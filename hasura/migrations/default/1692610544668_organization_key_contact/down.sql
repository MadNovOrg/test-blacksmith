
DELETE FROM "public"."role" WHERE "id" = 'ee233028-6270-4cc4-b5c6-07e4c482fe07';

alter table "public"."course" drop constraint "course_organization_key_contact_profile_id_fkey";

alter table "public"."course" alter column "organization_key_contact_invite_data" drop not null;
alter table "public"."course" drop column "organization_key_contact_invite_data" cascade;

alter table "public"."course" alter column "organization_key_contact_profile_id" drop not null;
alter table "public"."course" drop column "organization_key_contact_profile_id" cascade;

