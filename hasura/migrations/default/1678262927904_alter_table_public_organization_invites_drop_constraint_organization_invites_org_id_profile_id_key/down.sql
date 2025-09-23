alter table "public"."organization_invites" add constraint "organization_invites_org_id_profile_id_key" unique ("org_id", "profile_id");
