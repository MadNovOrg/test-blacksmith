CREATE TABLE "public"."course_pricing_changelog" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_pricing_id" uuid NOT NULL, "old_price" numeric NOT NULL, "new_price" numeric NOT NULL, "author_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("course_pricing_id") REFERENCES "public"."course_pricing"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("author_id") REFERENCES "public"."profile"("id") ON UPDATE no action ON DELETE no action);COMMENT ON TABLE "public"."course_pricing_changelog" IS E'Changelog for course pricing';
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
CREATE TRIGGER "set_public_course_pricing_changelog_updated_at"
BEFORE UPDATE ON "public"."course_pricing_changelog"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_pricing_changelog_updated_at" ON "public"."course_pricing_changelog" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
