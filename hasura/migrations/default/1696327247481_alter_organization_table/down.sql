
alter table "public"."organization" drop column "organisation_type";
alter table "public"."organization" add column "trust_name" text;
alter table "public"."organization" add column "trust_type" text;

alter table "public"."organization"
  add constraint "organization_trust_type_fkey"
  foreign key (trust_type)
  references "public"."trust_type"
  (name) on update cascade on delete cascade;
