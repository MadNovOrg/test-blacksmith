ALTER TABLE organization
ADD COLUMN IF NOT EXISTS tt_connect_id text UNIQUE;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'organization_tt_id'
          AND n.nspname = 'public'
    ) THEN
        CREATE SEQUENCE organization_tt_id
            START WITH 1000000
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END$$;

DO $$
DECLARE
    max_num bigint;
BEGIN
    SELECT MAX(CAST(SUBSTRING(tt_connect_id FROM 'TT-(\d+)') AS bigint))
    INTO max_num
    FROM organization;

    IF max_num IS NULL THEN
        max_num := 999999;
    END IF;

    PERFORM setval('organization_tt_id', max_num, true);
END$$;

CREATE OR REPLACE FUNCTION gen_tt_connect_id()
RETURNS text AS $$
DECLARE
    max_num bigint;
BEGIN
    SELECT MAX(CAST(SUBSTRING(tt_connect_id FROM 'TT-(\d+)') AS bigint))
    INTO max_num
    FROM organization;

    IF max_num IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN 'TT-' || nextval('organization_tt_id');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE organization
ALTER COLUMN tt_connect_id SET DEFAULT gen_tt_connect_id();

CREATE OR REPLACE FUNCTION sync_org_tt_seq()
RETURNS trigger AS $$
DECLARE
    new_num bigint;
    current_seq bigint;
BEGIN
    IF NEW.tt_connect_id IS DISTINCT FROM OLD.tt_connect_id 
       AND NEW.tt_connect_id IS NOT NULL THEN

        new_num := CAST(SUBSTRING(NEW.tt_connect_id FROM 'TT-(\d+)') AS bigint);

        SELECT last_value INTO current_seq FROM organization_tt_id;

        IF new_num > current_seq THEN
            PERFORM setval('organization_tt_id', new_num, true);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_org_tt_seq ON organization;

CREATE TRIGGER trg_sync_org_tt_seq
AFTER UPDATE OF tt_connect_id ON organization
FOR EACH ROW
EXECUTE FUNCTION sync_org_tt_seq();

