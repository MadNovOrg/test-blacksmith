alter table "public"."organization_member" add constraint "organization_member_profile_id_organization_id_key" unique ("profile_id", "organization_id");
