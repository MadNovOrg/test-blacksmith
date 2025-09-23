
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS dfe_establishment_urn_index ON public.dfe_establishment USING gin (urn gin_trgm_ops);
ALTER TABLE "public"."merged_organizations"
ADD COLUMN "dfe_urn" TEXT NULL;

UPDATE merged_organizations mo
SET dfe_urn = de.urn
FROM dfe_establishment de
WHERE
  mo.organization_data IS NOT NULL AND
  (mo.organization_data ->> 'dfeEstablishmentId') IS NOT NULL AND
  (mo.organization_data ->> 'dfeEstablishmentId') <> '' AND
  de.id::text = (mo.organization_data ->> 'dfeEstablishmentId');

ALTER TABLE "public"."merge_organizations_logs"
ADD COLUMN "primary_organization_urn" TEXT NULL;

CREATE INDEX "primary_organization_urn_idx"
ON "public"."merge_organizations_logs"
USING btree ("primary_organization_urn");
