CREATE TABLE "public"."organization_resource_packs" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "org_id" uuid NOT NULL,
    "resource_packs_type" text NOT NULL,
    "total_resource_packs" int4 NOT NULL DEFAULT 0,
    "reserved_resource_packs" int4 NOT NULL DEFAULT 0,
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("resource_packs_type") REFERENCES "public"."resource_packs_type" ("name") 
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    FOREIGN KEY ("org_id") REFERENCES "public"."organization" ("id") 
        ON UPDATE RESTRICT ON DELETE CASCADE,
    UNIQUE ("org_id", "resource_packs_type")
);

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_organization_resource_packs_updated_at"
BEFORE UPDATE ON "public"."organization_resource_packs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_organization_resource_packs_updated_at" 
ON "public"."organization_resource_packs"
IS 'Trigger to set value of column "updated_at" to current timestamp on row update';