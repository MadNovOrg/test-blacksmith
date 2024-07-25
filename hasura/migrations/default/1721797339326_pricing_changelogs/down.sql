ALTER TABLE "public"."course_pricing_schedule"
    ALTER COLUMN "course_pricing_id" SET NOT NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ALTER COLUMN "new_price" SET NOT NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ALTER COLUMN "old_price" SET NOT NULL;

ALTER TABLE "public"."course_pricing_changelog"
    DROP COLUMN "old_effective_from";

ALTER TABLE "public"."course_pricing_changelog"
    DROP COLUMN "new_effective_from";

ALTER TABLE "public"."course_pricing_changelog"
    DROP COLUMN "old_effective_to";

ALTER TABLE "public"."course_pricing_changelog"
    DROP COLUMN "new_effective_to";
