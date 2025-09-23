
DROP TRIGGER trigger_update_course_start_date_column ON course_schedule;
DROP FUNCTION update_course_start_date_column();
UPDATE course c SET start_date = NULL;
comment on column "public"."course"."start_date" is NULL;
DROP INDEX IF EXISTS "public"."idx_course_start_date";
ALTER TABLE "public"."course" DROP COLUMN "start_date";