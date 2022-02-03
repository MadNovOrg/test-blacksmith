alter table "public"."organization_member_role"
  add constraint "organization_member_role_organization_member_id_fkey"
  foreign key ("organization_member_id")
  references "public"."organization_member"
  ("id") on update cascade on delete cascade;
