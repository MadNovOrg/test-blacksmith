CREATE  INDEX "organization_member_profile_id_organization_role_id_key" on
  "public"."organization_member" using btree ("organization_id", "profile_id");
