CREATE TABLE "public"."course_pricing" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "type" Text NOT NULL,
  "level" Text NOT NULL,
  "blended" boolean NOT NULL,
  "reaccreditation" boolean NOT NULL,
  "price_amount" Numeric NOT NULL,
  "price_currency" text NOT NULL DEFAULT 'GBP',
  "xero_code" text NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("type") REFERENCES "public"."course_type"("name") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("level") REFERENCES "public"."course_level"("name") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("type", "level", "blended", "reaccreditation"),
  CONSTRAINT "Price must be positive" CHECK (price_amount >= 0));

COMMENT ON TABLE "public"."course_pricing" IS E'Prices per participant for various course variants';
COMMENT ON COLUMN "public"."course_pricing"."price_amount" IS E'Price per participant without any discounts';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
