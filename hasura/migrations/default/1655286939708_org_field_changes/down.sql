alter table "public"."profile" drop column "last_activity";
alter table "public"."organization" drop constraint "organization_trust_type_fkey";
drop table "public"."trust_type";
alter table "public"."organization" add column "last_activity" timestamptz;
alter table "public"."organization" alter column "last_activity" drop not null;
alter table "public"."profile" drop column "trust_name";
alter table "public"."profile" drop column "trust_type";

