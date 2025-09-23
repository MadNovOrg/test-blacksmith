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


