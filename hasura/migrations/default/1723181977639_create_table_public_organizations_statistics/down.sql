DROP TRIGGER IF EXISTS organization_trigger_organizations_statistics ON organization;
DROP TRIGGER IF EXISTS organization_member_trigger_organizations_statistics ON organization_member;
DROP TRIGGER IF EXISTS profile_trigger_organizations_statistics ON profile;
DROP TRIGGER IF EXISTS certification_trigger_organizations_statistics ON course_certificate;
DROP TRIGGER IF EXISTS course_certificate_hold_request_trigger_status ON course_certificate_hold_request;
DROP TRIGGER IF EXISTS course_certificate_trigger_status ON course_certificate;
DROP TRIGGER IF EXISTS course_participant_trigger_organizations_statistics ON course_participant;

DROP FUNCTION IF EXISTS trigger_organization_organizations_statistics();
DROP FUNCTION IF EXISTS trigger_organization_member_organizations_statistics();
DROP FUNCTION IF EXISTS trigger_profile_organizations_statistics();
DROP FUNCTION IF EXISTS trigger_certification_organizations_statistics();
DROP FUNCTION IF EXISTS trigger_course_certificate_hold_request_status();
DROP FUNCTION IF EXISTS trigger_course_certificate_status();

DROP FUNCTION IF EXISTS update_organizations_statistics(INT);
DROP FUNCTION IF EXISTS update_course_certificate_status(uuid);
DROP FUNCTION IF EXISTS update_certification_statuses();

DROP INDEX IF EXISTS idx_course_certificate_status;

DROP TABLE IF EXISTS "public"."organizations_statistics";
ALTER TABLE "public"."course_certificate" DROP COLUMN IF EXISTS "status";
