ALTER TABLE "public"."course_pricing" 
DROP CONSTRAINT "course_pricing_type_reaccreditation_blended_level_price_currency_key";

ALTER TABLE "public"."course_pricing" 
ADD CONSTRAINT "course_pricing_type_reaccreditation_blended_level_key" 
UNIQUE ("type", "reaccreditation", "blended", "level");
