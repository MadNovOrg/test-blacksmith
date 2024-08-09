alter table "public"."course" add column "search_fields" text null;

CREATE OR REPLACE FUNCTION update_course_search_fields(course_to_update_id INT)
 RETURNS VOID
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE course
    SET search_fields = (
        SELECT COALESCE(c.id::text || ' ', '') ||
               COALESCE(c.name || ' ', '') ||
               COALESCE(o.name || ' ', '') ||
               COALESCE(v.name || ' ', '') ||
               COALESCE(v.city || ' ', '') ||
               COALESCE(v.address_line_one || ' ', '') ||
               COALESCE(v.address_line_two || ' ', '') ||
               COALESCE(v.country || ' ', '') ||
               COALESCE(v.post_code || ' ', '') ||
               COALESCE(c.course_code || ' ', '') ||
               COALESCE(c."arloReferenceId" || ' ', '') ||
               COALESCE(
                   (SELECT string_agg(
                       t._given_name || ' ' || t._family_name || ' ' || 
                       COALESCE(t.translated_family_name, '') || ' ' ||
                       COALESCE(t.translated_given_name, ''), 
                       ' '
                    )
                    FROM profile AS t
                    JOIN course_trainer AS ct ON ct.profile_id = t.id 
                    WHERE ct.course_id = course_to_update_id
                   ) || ' ', ''
               )
        FROM course AS c
        LEFT JOIN organization AS o ON c.organization_id = o.id
        LEFT JOIN course_schedule AS cs ON cs.course_id = c.id
        LEFT JOIN venue AS v ON cs.venue_id = v.id
        WHERE c.id = course_to_update_id
    )
    WHERE id = course_to_update_id;
END;
$function$;

-- COURSE
CREATE OR REPLACE FUNCTION course_search_field_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
   IF TG_OP = 'INSERT' OR 
       (NEW.organization_id <> OLD.organization_id OR
        NEW."arloReferenceId" <> OLD."arloReferenceId") THEN
        PERFORM update_course_search_fields(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER update_course_search_field_on_course_change
AFTER INSERT OR UPDATE ON course
FOR EACH ROW
EXECUTE FUNCTION course_search_field_trigger();

-- COURSE TRAINER
CREATE OR REPLACE FUNCTION course_trainer_search_field_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT course_id FROM course_trainer WHERE profile_id = NEW.profile_id
    LOOP
        IF TG_OP = 'INSERT' THEN
            PERFORM update_course_search_fields(NEW.course_id);
        END IF;
        IF TG_OP = 'DELETE' THEN
            PERFORM update_course_search_fields(OLD.course_id);
        END IF;
    END LOOP;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER update_course_search_field_on_course_trainer_change
AFTER INSERT OR DELETE ON course_trainer
FOR EACH ROW
EXECUTE FUNCTION course_trainer_search_field_trigger();

-- PROFILE
CREATE OR REPLACE FUNCTION profile_search_field_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT course_id FROM course_trainer WHERE profile_id = NEW.id
    LOOP
        IF TG_OP = 'INSERT' OR 
        (
            NEW._given_name <> OLD._given_name OR
            NEW._family_name <> OLD._family_name OR
            NEW.translated_family_name <> OLD.translated_family_name OR
            NEW.translated_given_name <> OLD.translated_given_name
        )
        THEN
            PERFORM update_course_search_fields(rec.course_id);
        END IF;
    END LOOP;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER update_course_search_field_on_profile_change
AFTER INSERT OR UPDATE ON profile
FOR EACH ROW
EXECUTE FUNCTION profile_search_field_trigger();

-- ORGANIZATION
CREATE OR REPLACE FUNCTION organization_search_field_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT id FROM course WHERE organization_id = NEW.id
    LOOP
        IF TG_OP = 'UPDATE' AND (NEW.name <> OLD.name)
        THEN
            PERFORM update_course_search_fields(rec.id);
        END IF;
    END LOOP;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER update_course_search_field_on_organization_change
AFTER UPDATE ON organization
FOR EACH ROW
EXECUTE FUNCTION organization_search_field_trigger();

-- COURSE SCHEDULE
CREATE OR REPLACE FUNCTION course_schedule_search_field_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE	
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT course_id FROM course_schedule WHERE id = NEW.id
    LOOP
        IF TG_OP = 'INSERT' OR (NEW.venue_id <> OLD.venue_id)
            THEN PERFORM update_course_search_fields(rec.course_id);
        END IF;
    END LOOP;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER update_course_search_field_on_course_schedule_change
AFTER INSERT OR UPDATE ON course_schedule
FOR EACH ROW
EXECUTE FUNCTION course_schedule_search_field_trigger();


-- UPDATE EXISTING COURSES
DO $$
DECLARE
    course_record RECORD;
BEGIN
    FOR course_record IN
        SELECT id FROM course
    LOOP
        PERFORM update_course_search_fields(course_record.id);
    END LOOP;
END;
$$;
