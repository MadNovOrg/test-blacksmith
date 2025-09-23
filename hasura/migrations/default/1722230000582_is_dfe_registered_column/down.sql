DROP TRIGGER IF EXISTS organization_dfe_establishment_insert ON organization;

DROP TRIGGER IF EXISTS organization_dfe_establishment_update ON organization;

DROP TRIGGER IF EXISTS organization_dfe_establishment_delete ON organization;

DROP FUNCTION IF EXISTS update_dfe_establishment_registered();

ALTER TABLE "public"."dfe_establishment"
DROP COLUMN "registered";
