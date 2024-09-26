
ALTER TABLE organization ADD COLUMN urn text;
UPDATE organization
SET urn = dfe_establishment.urn
FROM dfe_establishment
WHERE organization.dfe_establishment_id = dfe_establishment.id;

CREATE OR REPLACE FUNCTION update_organization_urn_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.urn := (SELECT d.urn FROM dfe_establishment d WHERE d.id = NEW.dfe_establishment_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER populate_urn_on_insert
BEFORE INSERT ON organization
FOR EACH ROW
EXECUTE FUNCTION update_organization_urn_column();
