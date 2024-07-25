ALTER TABLE "public"."course_pricing_changelog"
    ADD COLUMN "old_effective_from" TIMESTAMP WITH TIME ZONE NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ADD COLUMN "new_effective_from" TIMESTAMP WITH TIME ZONE NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ADD COLUMN "old_effective_to" TIMESTAMP WITH TIME ZONE NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ADD COLUMN "new_effective_to" TIMESTAMP WITH TIME ZONE NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ALTER COLUMN "old_price" DROP NOT NULL;

ALTER TABLE "public"."course_pricing_changelog"
    ALTER COLUMN "new_price" DROP NOT NULL;

ALTER TABLE "public"."course_pricing_schedule"
    ALTER COLUMN "course_pricing_id" DROP NOT NULL;
