-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the main merge_organizations_logs table
CREATE TABLE "public"."merge_organizations_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "actioned_by_id" uuid NOT NULL,
  "primary_organization_id" uuid NOT NULL,
  "primary_organization_name" text NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("actioned_by_id") REFERENCES "public"."profile"("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMENT ON TABLE "public"."merge_organizations_logs" IS
  E'This table records data related to organization merge actions.';

-- Trigger function to update "updated_at" timestamp on row update
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_merge_organizations_logs_updated_at"
BEFORE UPDATE ON "public"."merge_organizations_logs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_merge_organizations_logs_updated_at" ON "public"."merge_organizations_logs"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Trigger function to update primary_organization_name when organization name changes
CREATE OR REPLACE FUNCTION update_merge_logs_on_org_name_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE merge_organizations_logs
    SET primary_organization_name = NEW.name,
        updated_at = now()
    WHERE primary_organization_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create merged_organizations table
CREATE TABLE "public"."merged_organizations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "organization_id" uuid NOT NULL,
  "organization_name" text NOT NULL,
  "organization_data" jsonb NOT NULL,
  "merge_organizations_log_id" uuid NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("organization_id"),
  FOREIGN KEY ("merge_organizations_log_id") 
    REFERENCES "public"."merge_organizations_logs"("id") 
    ON UPDATE RESTRICT 
    ON DELETE RESTRICT
);

COMMENT ON TABLE "public"."merged_organizations" IS
  E'This table contains records of all organizations that have been merged, each associated with a specific merge event.';

CREATE  INDEX "merge_organizations_logs_primary_organization_idx" on
  "public"."merge_organizations_logs" using btree ("primary_organization_id", "primary_organization_name");

CREATE  INDEX "merged_organizations_organization_name" on
  "public"."merged_organizations" using btree ("organization_name");
