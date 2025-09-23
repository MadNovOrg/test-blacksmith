CREATE OR REPLACE FUNCTION update_course_search_fields_trigger()
RETURNS trigger AS $$
BEGIN
  PERFORM update_course_search_fields(OLD.course_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_course_search_on_trainer_delete
AFTER DELETE ON course_trainer
FOR EACH ROW
EXECUTE FUNCTION update_course_search_fields_trigger();
