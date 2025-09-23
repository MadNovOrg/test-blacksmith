CREATE TABLE "public"."course_audit_type"
(
    "name" text NOT NULL,
    PRIMARY KEY ("name"),
    UNIQUE ("name")
);
INSERT INTO course_audit_type
VALUES (E'CANCELLATION'),
       (E'RESCHEDULE');

CREATE TABLE "public"."course_participant_audit_type"
(
    "name" text NOT NULL,
    PRIMARY KEY ("name"),
    UNIQUE ("name")
);
INSERT INTO course_participant_audit_type
VALUES (E'CANCELLATION'),
       (E'TRANSFER'),
       (E'REPLACEMENT');

CREATE TABLE "public"."course_participant_audit"
(
    "id"             uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"     timestamptz NOT NULL DEFAULT now(),
    "updated_at"     timestamptz NOT NULL DEFAULT now(),
    "participant_id" uuid        NOT NULL,
    "authorized_by"  uuid        NOT NULL,
    "type"           text        NOT NULL,
    "payload"        jsonb       NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("participant_id") REFERENCES "public"."course_participant" ("id") ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("authorized_by") REFERENCES "public"."profile" ("id") ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("type") REFERENCES "public"."course_participant_audit_type" ("name") ON UPDATE no action ON DELETE no action
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
CREATE TRIGGER "set_public_course_participant_audit_updated_at"
    BEFORE UPDATE
    ON "public"."course_participant_audit"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_participant_audit_updated_at" ON "public"."course_participant_audit"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."course_audit"
(
    "id"            uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"    timestamptz NOT NULL DEFAULT now(),
    "updated_at"    timestamptz NOT NULL DEFAULT now(),
    "course_id"     integer     NOT NULL,
    "authorized_by" uuid        NOT NULL,
    "type"          text        NOT NULL,
    "payload"       jsonb       NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("course_id") REFERENCES "public"."course" ("id") ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("authorized_by") REFERENCES "public"."profile" ("id") ON UPDATE no action ON DELETE no action,
    FOREIGN KEY ("type") REFERENCES "public"."course_audit_type" ("name") ON UPDATE no action ON DELETE no action
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
CREATE TRIGGER "set_public_course_audit_updated_at"
    BEFORE UPDATE
    ON "public"."course_audit"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_audit_updated_at" ON "public"."course_audit"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
