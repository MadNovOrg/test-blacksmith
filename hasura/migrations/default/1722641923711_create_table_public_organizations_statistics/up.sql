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

ALTER TABLE "public"."course_certificate" ADD COLUMN "status" text NULL;

CREATE OR REPLACE FUNCTION update_course_certificate_status(course_certificate_id uuid)
    RETURNS VOID
    LANGUAGE plpgsql
AS $function$
BEGIN 
    UPDATE course_certificate
    SET status = (
        SELECT 
            CASE
                WHEN cc.is_revoked THEN E'REVOKED'
                WHEN cc.id IN
                        (SELECT certificate_id FROM course_certificate_hold_request WHERE start_date < NOW()) THEN E'ON_HOLD'
                WHEN cc.expiry_date < NOW() - interval '3' month THEN E'EXPIRED'
                WHEN (cc.expiry_date >= NOW() - interval '3' month) AND
                        (cc.expiry_date < NOW()) THEN E'EXPIRED_RECENTLY'
                WHEN (cc.expiry_date >= NOW()) AND
                        (cc.expiry_date < NOW() + interval '3' month) THEN E'EXPIRING_SOON'
                ELSE E'ACTIVE'
           END
           FROM course_certificate AS cc
           WHERE cc.id = course_certificate_id
        )
    WHERE id = course_certificate_id;
END;
$function$;

CREATE INDEX IF NOT EXISTS idx_course_certificate_status ON course_certificate (status);

-- COURSE CERTIFICATE
CREATE OR REPLACE FUNCTION trigger_course_certificate_status()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN 
        IF TG_OP = 'INSERT' OR (NEW.is_revoked <> OLD.is_revoked OR NEW.expiry_date <> OLD.expiry_date) THEN
            PERFORM update_course_certificate_status(NEW.id);
        END IF;
        RETURN NEW;
    END;
$$;

-- COURSE CERTIFICATE TRIGGER
CREATE TRIGGER course_certificate_trigger_status
AFTER INSERT OR UPDATE
ON course_certificate
FOR EACH ROW
EXECUTE FUNCTION trigger_course_certificate_status();

-- COURSE CERTIFICATE HOLD REQUEST
CREATE OR REPLACE FUNCTION trigger_course_certificate_hold_request_status()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN 
        IF TG_OP = 'INSERT' OR (NEW.start_date <> OLD.start_date) THEN
            PERFORM update_course_certificate_status(NEW.certificate_id);
        END IF;
        RETURN NEW;
    END;
$$;

-- COURSE CERTIFICATE HOLD REQUEST TRIGGER
CREATE TRIGGER course_certificate_hold_request_trigger_status
AFTER INSERT OR UPDATE
ON course_certificate_hold_request
FOR EACH ROW
EXECUTE FUNCTION trigger_course_certificate_hold_request_status();

CREATE OR REPLACE FUNCTION update_certification_statuses()
 RETURNS SETOF course_certificate
 LANGUAGE plpgsql
AS $function$
DECLARE
    cert_record RECORD;
BEGIN
    FOR cert_record IN
        SELECT id FROM course_certificate
    LOOP
        PERFORM update_course_certificate_status(cert_record.id);
    END LOOP;
END;
$function$;

--UPDATE EXISTING CERTIFICATIONS
DO $$
BEGIN
    PERFORM update_certification_statuses();
END
$$;


CREATE TABLE "public"."organizations_statistics" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "organization_id" uuid NOT NULL, "individuals" integer NOT NULL DEFAULT 0, "active_certifications" integer NOT NULL DEFAULT 0, "on_hold_certifications" integer NOT NULL DEFAULT 0, "expiring_soon_certifications" integer NOT NULL DEFAULT 0, "expired_recently_certifications" integer NOT NULL DEFAULT 0, PRIMARY KEY ("id") , FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON UPDATE restrict ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE OR REPLACE FUNCTION update_organizations_statistics(org_id uuid)
    RETURNS VOID
    LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM organizations_statistics WHERE organization_id = org_id;
    INSERT INTO organizations_statistics(organization_id, individuals, active_certifications, on_hold_certifications, expiring_soon_certifications, expired_recently_certifications)
        VALUES (org_id, (SELECT COUNT(*) FROM organization_member WHERE organization_id = org_id),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cp.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'ACTIVE' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cp.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'ON_HOLD' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cp.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'EXPIRING_SOON' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)),
                (SELECT COUNT(DISTINCT cc.id) FROM course_certificate AS cc
                    LEFT JOIN course_participant AS cp ON cc.id = cp.certificate_id
                    LEFT JOIN profile AS p ON cp.profile_id = p.id
                    LEFT JOIN organization_member as om ON om.profile_id = p.id
                    WHERE om.organization_id = org_id AND cc.status = 'EXPIRED_RECENTLY' AND p.archived IS FALSE AND (cp.completed_evaluation IS TRUE OR cc.legacy_course_code IS NOT NULL)));
END;
$function$;

-- ORGANIZATION MEMBER
CREATE OR REPLACE FUNCTION trigger_organization_member_organizations_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM update_organizations_statistics(NEW.organization_id);
    END IF;
    IF TG_OP = 'DELETE' THEN
        PERFORM update_organizations_statistics(OLD.organization_id);
    END IF;
    RETURN NULL;
END;
$$;

-- ORGANIZATION MEMBER TRIGGER
CREATE TRIGGER organization_member_trigger_organizations_statistics
    AFTER INSERT OR DELETE
    ON organization_member
    FOR EACH ROW
    EXECUTE FUNCTION trigger_organization_member_organizations_statistics();

-- PROFILE
CREATE OR REPLACE FUNCTION trigger_profile_organizations_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT organization_id FROM organization_member WHERE profile_id = NEW.id
    LOOP
        IF TG_OP = 'UPDATE' AND NEW.archived <> OLD.archived THEN
            PERFORM update_organizations_statistics(organization_id);
        END IF;
    END LOOP;
    RETURN NULL;
END;
$$;

-- PROFILE TRIGGER
CREATE TRIGGER profile_trigger_organizations_statistics
    AFTER UPDATE
    ON profile
    FOR EACH ROW
    EXECUTE FUNCTION trigger_profile_organizations_statistics();
    
-- CERTIFICATION
CREATE OR REPLACE FUNCTION trigger_certification_organizations_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT organization_id FROM organization_member WHERE profile_id = NEW.profile_id
    LOOP
        IF TG_OP = 'INSERT' THEN
            PERFORM update_organizations_statistics(rec.organization_id);
            END IF;
        IF TG_OP = 'UPDATE' AND NEW.status <> OLD.status THEN
            PERFORM update_organizations_statistics(rec.organization_id);
            END IF;
        IF TG_OP = 'DELETE' THEN
            PERFORM update_organizations_statistics(rec.organization_id);
        END IF;
    END LOOP;
    RETURN NULL;
END;
$$;
-- CERTIFICATION TRIGGER
CREATE TRIGGER certification_trigger_organizations_statistics
    AFTER INSERT OR UPDATE OR DELETE
    ON course_certificate
    FOR EACH ROW
    EXECUTE FUNCTION trigger_certification_organizations_statistics();

-- COURSE PARTICIPANT
CREATE OR REPLACE FUNCTION trigger_course_participant_organizations_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT organization_id FROM organization_member WHERE profile_id = NEW.profile_id
    LOOP
        IF TG_OP = 'UPDATE' AND NEW.completed_evaluation <> OLD.completed_evaluation THEN
            PERFORM update_organizations_statistics(rec.organization_id);
            END IF;
    END LOOP;
    RETURN NULL;
END;
$$;

-- COURSE PARTICIPANT TRIGGER
CREATE TRIGGER course_participant_trigger_organizations_statistics
    AFTER UPDATE
    ON course_participant
    FOR EACH ROW
    EXECUTE FUNCTION trigger_course_participant_organizations_statistics();


DO $$
DECLARE
    org_record RECORD;
BEGIN
    FOR org_record IN
        SELECT id FROM organization
    LOOP
        PERFORM update_organizations_statistics(org_record.id);
    END LOOP;
END;
$$;