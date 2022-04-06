CREATE TABLE "public"."course_certificate" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "course_id" integer NOT NULL, "course_participant_id" uuid NOT NULL, "number" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE no action ON DELETE cascade, FOREIGN KEY ("course_participant_id") REFERENCES "public"."course_participant"("id") ON UPDATE no action ON DELETE cascade, UNIQUE ("number"), UNIQUE ("course_id", "course_participant_id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_course_certificate_updated_at"
BEFORE UPDATE ON "public"."course_certificate"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_certificate_updated_at" ON "public"."course_certificate" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION course_certificate_number_generation_trigger()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
BEGIN
    NEW.number = CONCAT(NEW.number, '-', (
        SELECT COUNT(*) + 1
        FROM course_certificate
        WHERE course_id = NEW.course_id
    ));
    RETURN NEW;
END
$$;

CREATE TRIGGER course_certificate_number_generation_trigger
    BEFORE INSERT
    ON course_certificate
    FOR EACH ROW EXECUTE PROCEDURE course_certificate_number_generation_trigger();
