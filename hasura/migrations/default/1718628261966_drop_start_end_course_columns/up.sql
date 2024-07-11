DROP TRIGGER IF EXISTS update_course_schedule ON course_schedule;

DROP FUNCTION IF EXISTS update_course_start_end();

ALTER TABLE "public"."course" DROP COLUMN "start";
ALTER TABLE "public"."course" DROP COLUMN "end";
