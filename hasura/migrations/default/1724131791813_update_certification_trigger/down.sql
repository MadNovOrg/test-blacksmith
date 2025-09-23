   
DROP TRIGGER IF EXISTS certification_trigger_organizations_statistics ON course_certificate;
DROP FUNCTION IF EXISTS trigger_certification_organizations_statistics();
DROP FUNCTION IF EXISTS update_all_organizations_statistics();
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
