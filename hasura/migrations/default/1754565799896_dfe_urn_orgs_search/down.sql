
DROP INDEX IF EXISTS "public"."primary_organization_urn_idx";

ALTER TABLE "public"."merge_organizations_logs"
DROP COLUMN "primary_organization_urn";

ALTER TABLE "public"."merged_organizations"
DROP COLUMN "dfe_urn";

DROP INDEX IF EXISTS dfe_establishment_urn_index;