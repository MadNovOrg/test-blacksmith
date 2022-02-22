CREATE TABLE "public"."module_group_duration" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "module_group_id" uuid NOT NULL,
    "course_delivery_type" text NOT NULL,
    "reaccreditation" boolean NOT NULL DEFAULT false,
    "duration" integer NOT NULL DEFAULT '0',
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("module_group_id") REFERENCES "public"."module_group"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("course_delivery_type") REFERENCES "public"."course_delivery_type"("name") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));
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
CREATE TRIGGER "set_public_module_group_duration_updated_at"
BEFORE UPDATE ON "public"."module_group_duration"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_module_group_duration_updated_at" ON "public"."module_group_duration" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
