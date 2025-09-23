
DROP TRIGGER trigger_update_course_end_date_column ON course_schedule;
DROP FUNCTION update_course_end_date_column();
UPDATE course c SET end_date = NULL;
comment on column "public"."course"."end_date" is NULL;
DROP INDEX IF EXISTS "public"."idx_course_end_date";
ALTER TABLE "public"."course" DROP COLUMN "end_date";