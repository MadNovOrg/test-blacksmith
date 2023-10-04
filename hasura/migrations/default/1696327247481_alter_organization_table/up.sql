alter table "public"."organization" drop column "trust_type" cascade;

alter table "public"."organization" drop column "trust_name" cascade;

alter table "public"."organization" add column "organisation_type" text
 null;
