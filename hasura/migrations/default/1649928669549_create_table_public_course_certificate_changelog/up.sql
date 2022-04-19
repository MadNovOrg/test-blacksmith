CREATE TABLE "public"."course_certificate_changelog"
(
    "id"             uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"     timestamptz NOT NULL DEFAULT now(),
    "updated_at"     timestamptz NOT NULL DEFAULT now(),
    "participant_id" uuid        NOT NULL,
    "old_grade"      text        NOT NULL,
    "new_grade"      text        NOT NULL,
    "notes"          text        NOT NULL,
    "author_id"         uuid        NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("author_id") REFERENCES "public"."profile" ("id") ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY ("old_grade") REFERENCES "public"."grade" ("name") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("new_grade") REFERENCES "public"."grade" ("name") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("participant_id") REFERENCES "public"."course_participant" ("id") ON UPDATE no action ON DELETE cascade
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_course_certificate_changelog_updated_at"
    BEFORE UPDATE
    ON "public"."course_certificate_changelog"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_certificate_changelog_updated_at" ON "public"."course_certificate_changelog"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
