alter table "public"."organization" drop constraint if exists "organization_urn_key";
alter table "public"."organization" add constraint "organization_urn_key" unique ("urn");
