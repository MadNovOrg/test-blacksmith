-- Drop column from org_resource_packs_pricing
ALTER TABLE "public"."org_resource_packs_pricing"
  DROP COLUMN "synced_from_main";

-- Drop foreign key constraints
ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  DROP CONSTRAINT "org_resource_packs_pricing_changelog_resource_packs_pricing_fk";

ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  DROP CONSTRAINT "org_resource_packs_pricing_changelog_org_id_fkey";

-- Drop index if it exists
DROP INDEX IF EXISTS "public"."org_resource_packs_pricing_idx";

-- Nullify values in changelog columns before dropping
UPDATE "public"."org_resource_packs_pricing_changelog"
SET
  org_id = NULL,
  resource_packs_pricing_id = NULL
WHERE
  org_id IS NOT NULL
  OR resource_packs_pricing_id IS NOT NULL;

-- Drop columns from changelog table
ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  DROP COLUMN IF EXISTS "resource_packs_pricing_id";

ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  DROP COLUMN IF EXISTS "org_id";
