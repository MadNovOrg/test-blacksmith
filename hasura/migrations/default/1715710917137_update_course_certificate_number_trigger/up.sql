CREATE OR REPLACE FUNCTION public.course_certificate_number_generation_trigger()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (NEW.course_id IS NOT NULL) THEN
        WITH max_number AS (
            SELECT MAX(
                CASE 
                WHEN reverse(split_part(reverse(number), '-', 1))  ~ '^\d+$'
                THEN reverse(split_part(reverse(number), '-', 1))::int
                ELSE 0
                END
            ) AS max_suffix
            FROM course_certificate
            WHERE course_id = NEW.course_id
        )
        SELECT CONCAT(NEW.number, '-', COALESCE(max_suffix + 1, 1)) INTO NEW.number
        FROM max_number;
    END IF;
    RETURN NEW;
END
$$;