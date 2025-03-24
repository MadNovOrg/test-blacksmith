
alter table "public"."course" add column "start_date" date
 null;
comment on column "public"."course"."start_date" is E'Column used only for querying courses in a sorted order as having this column here queries data quicker than relying on course_schedule values. This column is updated automatically via course_schedule triggers';

CREATE  INDEX "idx_course_start_date" on
  "public"."course" using btree ("start_date");


UPDATE course c
SET start_date = cs.start
FROM course_schedule cs
WHERE c.id = cs.course_id;

CREATE OR REPLACE FUNCTION update_course_start_date_column()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE course
    SET start_date = NEW.start
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_start_date_column
AFTER INSERT OR UPDATE ON course_schedule
FOR EACH ROW
EXECUTE FUNCTION update_course_start_date_column();
