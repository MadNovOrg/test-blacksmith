DROP TRIGGER trigger_profile_updated_at ON "profile";

DROP TRIGGER trigger_organization_updated_at ON "organization";

DROP TRIGGER trigger_organization_member_updated_at ON "organization_member";

DROP TRIGGER trigger_profile_role_updated_at ON "profile_role";

DROP TRIGGER trigger_organization_role_updated_at ON "organization_role";

DROP FUNCTION updated_at_field CASCADE;

DROP TABLE "identity_type";

DROP TABLE "profile_status";

DROP TABLE "organization_status";

DROP TABLE "profile_role";

DROP TABLE "organization_member";

DROP TABLE "organization_role";

DROP TABLE "organization_group";

DROP TABLE "identity";

DROP TABLE "profile";

DROP TABLE "organization";

DROP TABLE "role";
