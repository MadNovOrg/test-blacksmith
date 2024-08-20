DROP TRIGGER IF EXISTS certification_trigger_organizations_statistics ON course_certificate;
DROP FUNCTION IF EXISTS trigger_certification_organizations_statistics();

-- CERTIFICATION
CREATE OR REPLACE FUNCTION trigger_certification_organizations_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    IF TG_OP = 'DELETE' THEN
        FOR rec IN SELECT organization_id FROM organization_member WHERE profile_id = OLD.profile_id LOOP
            PERFORM update_organizations_statistics(rec.organization_id);
        END LOOP;
    ELSE
        FOR rec IN SELECT organization_id FROM organization_member WHERE profile_id = NEW.profile_id LOOP
            -- Handle INSERT operation
            IF TG_OP = 'INSERT' THEN
                PERFORM update_organizations_statistics(rec.organization_id);
            END IF;
            
            -- Handle UPDATE operation with status change
            IF TG_OP = 'UPDATE' AND NEW.status <> OLD.status THEN
                PERFORM update_organizations_statistics(rec.organization_id);
            END IF;
        END LOOP;
    END IF;
    RETURN NULL;
END;
$$;

-- CERTIFICATION TRIGGER
CREATE TRIGGER certification_trigger_organizations_statistics
    AFTER INSERT OR UPDATE OR DELETE
    ON course_certificate
    FOR EACH ROW
    EXECUTE FUNCTION trigger_certification_organizations_statistics();


CREATE OR REPLACE FUNCTION update_all_organizations_statistics()
 RETURNS SETOF organizations_statistics
 LANGUAGE plpgsql
AS $function$
DECLARE
    org_record RECORD;
BEGIN
    FOR org_record IN
        SELECT id FROM organization
    LOOP
        PERFORM update_organizations_statistics(org_record.id);
    END LOOP;
END;
$function$;

