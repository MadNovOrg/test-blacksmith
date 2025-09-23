ALTER TABLE "public"."course" 
    ADD COLUMN "end" timestamptz;

ALTER TABLE "public"."course" 
    ADD COLUMN "start" timestamptz;

CREATE OR REPLACE FUNCTION update_course_start_end()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE course
  SET start = (SELECT MIN(start) FROM course_schedule WHERE course_id = NEW.course_id),
      "end" = (SELECT MAX("end") FROM course_schedule WHERE course_id = NEW.course_id)
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

UPDATE course c
SET start = (SELECT MIN(start) FROM course_schedule WHERE course_id = c.id),
    "end" = (SELECT MAX("end") FROM course_schedule WHERE course_id = c.id);

CREATE TRIGGER update_course_schedule
AFTER INSERT OR UPDATE OF start, "end" ON course_schedule
FOR EACH ROW
EXECUTE FUNCTION update_course_start_end();
