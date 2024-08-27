
alter table "public"."organization" add column if not exists "main_organisation_id" uuid
 null;
