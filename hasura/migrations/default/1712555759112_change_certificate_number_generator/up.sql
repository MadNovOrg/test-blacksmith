CREATE OR REPLACE FUNCTION public.course_certificate_number_generation_trigger()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (NEW.course_id IS NOT NULL) THEN
        WITH max_number AS (
            SELECT MAX(split_part(number, '-', -1)::int) AS max_suffix
            FROM course_certificate
            WHERE course_id = NEW.course_id
        )
        SELECT CONCAT(NEW.number, '-', COALESCE(max_suffix + 1, 1)) INTO NEW.number
        FROM max_number;
    END IF;
    RETURN NEW;
END
$$;