CREATE OR REPLACE FUNCTION insert_organization_resource_packs() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO organization_resource_packs (org_id, resource_packs_type)
    VALUES (NEW.id, 'DIGITAL_WORKBOOK'), (NEW.id, 'PRINT_WORKBOOK');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_default_resource_packs_for_organization
AFTER INSERT ON organization
FOR EACH ROW
EXECUTE FUNCTION insert_organization_resource_packs();

DO $$
DECLARE
    org_rec RECORD;
BEGIN
    FOR org_rec IN 
        SELECT id FROM organization
    LOOP
        IF NOT EXISTS (
            SELECT 1
            FROM organization_resource_packs
            WHERE org_id = org_rec.id
            AND resource_packs_type = 'DIGITAL_WORKBOOK'
        ) THEN
            INSERT INTO organization_resource_packs (org_id, resource_packs_type)
            VALUES (org_rec.id, 'DIGITAL_WORKBOOK');
        END IF;
        
        IF NOT EXISTS (
            SELECT 1
            FROM organization_resource_packs
            WHERE org_id = org_rec.id
            AND resource_packs_type = 'PRINT_WORKBOOK'
        ) THEN
            INSERT INTO organization_resource_packs (org_id, resource_packs_type)
            VALUES (org_rec.id, 'PRINT_WORKBOOK');
        END IF;
    END LOOP;
END $$;

CREATE  INDEX "idx_organization" on
  "public"."organization_resource_packs" using btree ("org_id");



