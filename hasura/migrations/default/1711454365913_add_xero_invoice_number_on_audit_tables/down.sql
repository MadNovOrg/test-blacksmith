DROP INDEX IF EXISTS idx_organization_name;
DROP INDEX IF EXISTS idx_order_xero_invoice_number;

DROP INDEX IF EXISTS idx_course_audit_xero_invoice_number;
DROP INDEX IF EXISTS idx_course_audit_authorized_by;
DROP INDEX IF EXISTS idx_course_audit_course_id;


DROP INDEX IF EXISTS idx_course_participant_audit_payload;
DROP INDEX IF EXISTS idx_course_participant_audit_authorized_by;
DROP INDEX IF EXISTS idx_course_participant_audit_course_id;
DROP INDEX IF EXISTS idx_course_participant_audit_profile_id;
DROP INDEX IF EXISTS idx_course_participant_audit_xero_invoice_number;


DROP INDEX IF EXISTS idx_course_name;
DROP INDEX IF EXISTS idx_course_arlo_reference_id;
DROP INDEX IF EXISTS idx_venue_name;
DROP INDEX IF EXISTS idx_venue_city;
DROP INDEX IF EXISTS idx_venue_address_line_one;
DROP INDEX IF EXISTS idx_venue_address_line_two;
DROP INDEX IF EXISTS idx_venue_country;
DROP INDEX IF EXISTS idx_venue_post_code;

DROP FUNCTION IF EXISTS merge_course_audit_rows(course_audit);

DROP FUNCTION IF EXISTS merge_course_participant_audit_rows(course_participant_audit);

ALTER TABLE course_participant_audit
DROP COLUMN xero_invoice_number;

ALTER TABLE course_audit
DROP COLUMN xero_invoice_number;
