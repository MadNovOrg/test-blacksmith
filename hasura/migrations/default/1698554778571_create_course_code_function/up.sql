CREATE OR REPLACE FUNCTION course_state(course_row course)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $function$
BEGIN
  RETURN (
    SELECT
      CASE
        WHEN start > NOW() THEN 'SCHEDULED'
        WHEN start <= NOW() AND "end" >= NOW() THEN 'IN_PROGRESS'
        WHEN start < NOW() AND "end" < NOW() THEN 'COMPLETED'
      END
    FROM course_schedule
    WHERE course_id = course_row.id
    LIMIT 1
  );
END;
$function$;
