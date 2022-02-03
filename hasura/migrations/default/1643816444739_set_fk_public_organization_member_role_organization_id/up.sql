alter table "public"."organization_member_role" drop constraint "organization_member_organization_role_id_fkey",
  add constraint "organization_member_role_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization_role"
  ("id") on update no action on delete no action;
