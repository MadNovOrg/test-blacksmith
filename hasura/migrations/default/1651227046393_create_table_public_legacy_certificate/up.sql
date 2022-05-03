CREATE TABLE "public"."legacy_certificate" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "original_record" jsonb NOT NULL DEFAULT '{}'::jsonb, "number" text NOT NULL, "course_name" text NOT NULL, "legacy_id" integer NOT NULL, "email" text NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "expiry_date" date NOT NULL, "certification_date" date NOT NULL, PRIMARY KEY ("id") , UNIQUE ("legacy_id"), UNIQUE ("number"));
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
CREATE TRIGGER "set_public_legacy_certificate_updated_at"
BEFORE UPDATE ON "public"."legacy_certificate"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_legacy_certificate_updated_at" ON "public"."legacy_certificate" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION course_certificate_number_generation_trigger()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
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

alter table "public"."course_participant" add column "certificate_id" uuid null;
alter table "public"."course_participant"
    add constraint "course_participant_certificate_id_fkey"
        foreign key ("certificate_id")
            references "public"."course_certificate"
                ("id") on update no action on delete cascade;
UPDATE course_participant SET certificate_id = certificate.id
FROM course_certificate certificate
WHERE certificate.course_participant_id = course_participant.id;
alter table "public"."course_certificate" drop column "course_participant_id" cascade;

alter table "public"."course_certificate" add column "profile_id" uuid null;
UPDATE course_certificate SET profile_id = cp.profile_id
FROM course_participant cp
WHERE cp.certificate_id = course_certificate.id;
alter table "public"."course_certificate" alter column "profile_id" set not null;
