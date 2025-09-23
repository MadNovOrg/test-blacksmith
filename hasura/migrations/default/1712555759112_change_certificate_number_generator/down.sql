CREATE OR REPLACE FUNCTION public.course_certificate_number_generation_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (NEW.course_id IS NOT NULL) THEN
        NEW.number = CONCAT(NEW.number, '-', (
            SELECT COUNT(*) + 1
            FROM course_certificate
            WHERE course_id = NEW.course_id
        ));
    END IF;
    RETURN NEW;
END
$$;