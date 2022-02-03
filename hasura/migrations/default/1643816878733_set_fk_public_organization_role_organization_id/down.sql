alter table "public"."organization_role" drop constraint "organization_role_organization_id_fkey",
  add constraint "organization_role_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization"
  ("id") on update no action on delete cascade;
