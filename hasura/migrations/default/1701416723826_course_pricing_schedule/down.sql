
alter table "public"."course_pricing_changelog" drop constraint "course_pricing_changelog_course_pricing_schedule_id_fkey",
  add constraint "course_pricing_changelog_course_pricing_schedule_id_fkey"
  foreign key ("course_pricing_schedule_id")
  references "public"."course_pricing_schedule"
  ("id") on update restrict on delete restrict;


alter table "public"."course_pricing_changelog" drop constraint "course_pricing_changelog_course_pricing_schedule_id_fkey";

ALTER TABLE "public"."course_pricing_changelog" DROP COLUMN "course_pricing_schedule_id";

--
ALTER TABLE "public"."course_pricing_schedule" DROP COLUMN "updated_at";

ALTER TABLE "public"."course_pricing_schedule" DROP COLUMN "created_at";
