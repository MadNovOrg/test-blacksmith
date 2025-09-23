DROP INDEX IF EXISTS idx_course_type;
DROP INDEX IF EXISTS idx_course_delivery_type;
DROP INDEX IF EXISTS idx_course_level;
DROP INDEX IF EXISTS idx_course_accredited_by;
DROP INDEX IF EXISTS idx_course_go1_integration;
DROP INDEX IF EXISTS idx_course_reaccreditation;
DROP INDEX IF EXISTS idx_course_conversion;

DROP INDEX IF EXISTS idx_given_name;
DROP INDEX IF EXISTS idx_family_name;
DROP INDEX IF EXISTS idx_avatar;
DROP INDEX IF EXISTS idx_archived;

DROP INDEX IF EXISTS idx_certificates_course_level;
DROP INDEX IF EXISTS idx_course_certificate_is_revoked;
DROP INDEX IF EXISTS idx_course_certificate_expiry_date;

DROP INDEX IF EXISTS idx_course_schedule_start;

DROP INDEX IF EXISTS idx_course_certificate_changelog_payload;

DROP INDEX IF EXISTS idx_course_certificate_participant_id;

DROP INDEX IF EXISTS idx_course_certificate_hold_request_certificate_id;
DROP INDEX IF EXISTS idx_course_certificate_hold_request_start_date;
