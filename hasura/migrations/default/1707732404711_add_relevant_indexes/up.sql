CREATE INDEX IF NOT EXISTS idx_course_type ON course (course_type);
CREATE INDEX IF NOT EXISTS idx_course_delivery_type ON course (course_delivery_type);
CREATE INDEX IF NOT EXISTS idx_course_level ON course (course_level);
CREATE INDEX IF NOT EXISTS idx_course_accredited_by ON course (accredited_by);
CREATE INDEX IF NOT EXISTS idx_course_go1_integration ON course (go1_integration);
CREATE INDEX IF NOT EXISTS idx_course_reaccreditation ON course (reaccreditation);
CREATE INDEX IF NOT EXISTS idx_course_conversion ON course (conversion);

CREATE INDEX IF NOT EXISTS idx_given_name ON profile (_given_name);
CREATE INDEX IF NOT EXISTS idx_family_name ON profile (_family_name);
CREATE INDEX IF NOT EXISTS idx_avatar ON profile (avatar);
CREATE INDEX IF NOT EXISTS idx_archived ON profile (archived);

CREATE INDEX IF NOT EXISTS idx_certificates_course_level ON course_certificate (course_level);
CREATE INDEX IF NOT EXISTS idx_course_certificate_is_revoked ON course_certificate (is_revoked);
CREATE INDEX IF NOT EXISTS idx_course_certificate_expiry_date ON course_certificate (expiry_date);
CREATE INDEX IF NOT EXISTS idx_course_certificate_participant_id ON course_certificate (profile_id);

CREATE INDEX IF NOT EXISTS idx_course_certificate_hold_request_certificate_id ON course_certificate_hold_request (certificate_id);
CREATE INDEX IF NOT EXISTS idx_course_certificate_hold_request_start_date ON course_certificate_hold_request (start_date);

CREATE INDEX IF NOT EXISTS idx_course_schedule_start ON course_schedule (start);

CREATE INDEX IF NOT EXISTS idx_course_certificate_changelog_payload ON course_certificate_changelog (payload);

CREATE INDEX IF NOT EXISTS idx_participant_certificate_id ON course_participant (certificate_id);
