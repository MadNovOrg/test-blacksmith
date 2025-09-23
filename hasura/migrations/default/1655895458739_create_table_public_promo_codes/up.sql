ALTER TABLE "public"."order" ALTER COLUMN "promo_codes" TYPE jsonb;
ALTER TABLE "public"."order" ALTER COLUMN "promo_codes" SET DEFAULT '[]'::jsonb;

CREATE TABLE "public"."promo_code_type" ("name" text NOT NULL, PRIMARY KEY ("name") );
INSERT INTO "promo_code_type" ("name") VALUES ('PERCENT'), ('FREE_PLACES');

CREATE TABLE "public"."promo_code" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "code" text NOT NULL UNIQUE,
  "description" text,
  "type" text NOT NULL DEFAULT 'PERCENT'::text,
  "amount" numeric NOT NULL DEFAULT 0,
  "valid_from" timestamptz NOT NULL DEFAULT now(),
  "valid_to" timestamptz,
  "booker_single_use" boolean NOT NULL DEFAULT true,
  "uses_max" numeric,
  "levels" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "courses" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "enabled" boolean NOT NULL DEFAULT true,
  "approved_by" uuid,
  "created_by" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

ALTER TABLE "public"."promo_code" ADD CONSTRAINT "promo_code_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."promo_code_type" ("name") ON UPDATE RESTRICT ON DELETE RESTRICT;

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"() RETURNS TRIGGER AS $$
  DECLARE
    _new record;
  BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_promo_code_updated_at" BEFORE UPDATE ON "public"."promo_code" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

CREATE EXTENSION IF NOT EXISTS pgcrypto;
