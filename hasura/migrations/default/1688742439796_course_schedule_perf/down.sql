DROP TRIGGER update_course_schedule ON course_schedule;

DROP FUNCTION update_course_start_end();

alter table "public"."course" drop column "start";
alter table "public"."course" drop column "end";
