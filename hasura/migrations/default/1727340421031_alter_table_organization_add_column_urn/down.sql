
DROP TRIGGER IF EXISTS populate_urn_on_insert ON organization;

DROP FUNCTION IF EXISTS update_organization_urn_column();

ALTER TABLE organization drop COLUMN urn;
