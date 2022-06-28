ALTER TABLE "public"."order" ALTER COLUMN "promo_codes" SET DEFAULT '{}'::json;
ALTER TABLE "public"."order" ALTER COLUMN "promo_codes" TYPE json;
ALTER TABLE "public"."promo_code" DROP CONSTRAINT "promo_code_type_fkey";
DROP TABLE "public"."promo_code";
DROP TABLE "public"."promo_code_type";
