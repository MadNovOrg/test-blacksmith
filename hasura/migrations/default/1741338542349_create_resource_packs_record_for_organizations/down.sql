DROP INDEX IF EXISTS "public"."idx_organization";

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'insert_default_resource_packs_for_organization') THEN
        DROP TRIGGER insert_default_resource_packs_for_organization ON organization;
    END IF;
END $$;
