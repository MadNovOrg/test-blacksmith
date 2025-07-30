-- Add columns to the changelog table
ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  ADD COLUMN "org_id" UUID NULL;

ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  ADD COLUMN "resource_packs_pricing_id" UUID NULL;

-- Backfill org_id and resource_packs_pricing_id from updated_columns
UPDATE "public"."org_resource_packs_pricing_changelog"
SET
  org_id = COALESCE(
    (updated_columns->'new'->>'organisation_id')::uuid,
    (updated_columns->'old'->>'organisation_id')::uuid
  ),
  resource_packs_pricing_id = COALESCE(
    (updated_columns->'new'->>'resource_packs_pricing_id')::uuid,
    (updated_columns->'old'->>'resource_packs_pricing_id')::uuid
  )
WHERE
  org_id IS NULL
  OR resource_packs_pricing_id IS NULL;

-- Create index on org_id and resource_packs_pricing_id
CREATE INDEX "org_resource_packs_pricing_idx"
  ON "public"."org_resource_packs_pricing_changelog"
  USING btree ("org_id", "resource_packs_pricing_id");

-- Add foreign key constraint on resource_packs_pricing_id
ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  ADD CONSTRAINT "org_resource_packs_pricing_changelog_resource_packs_pricing_fk"
  FOREIGN KEY ("resource_packs_pricing_id")
  REFERENCES "public"."resource_packs_pricing"("id")
  ON UPDATE RESTRICT
  ON DELETE RESTRICT;

-- Add foreign key constraint on org_id
ALTER TABLE "public"."org_resource_packs_pricing_changelog"
  ADD CONSTRAINT "org_resource_packs_pricing_changelog_org_id_fkey"
  FOREIGN KEY ("org_id")
  REFERENCES "public"."organization"("id")
  ON UPDATE RESTRICT
  ON DELETE RESTRICT;

-- Add synced_from_main column to org_resource_packs_pricing
ALTER TABLE "public"."org_resource_packs_pricing"
  ADD COLUMN "synced_from_main" BOOLEAN NOT NULL DEFAULT false;
