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

ALTER TABLE "public"."course_certificate" ADD COLUMN "course_participant_id" uuid NULL;

UPDATE course_certificate SET course_participant_id = participant.id
FROM course_participant participant
WHERE participant.certificate_id = course_certificate.id;

ALTER TABLE "public"."course_participant"
    DROP CONSTRAINT "course_participant_certificate_id_fkey";

ALTER TABLE "public"."course_participant" DROP COLUMN "certificate_id";

ALTER TABLE "public"."course_certificate" DROP COLUMN "profile_id";

DROP TABLE "public"."legacy_certificate";
