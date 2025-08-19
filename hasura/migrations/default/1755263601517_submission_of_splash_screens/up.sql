CREATE TABLE "public"."splash_screens" (
    "name" TEXT NOT NULL,
    PRIMARY KEY ("name"),
    UNIQUE ("name")
);

COMMENT ON TABLE "public"."splash_screens" IS 
E'Stores the enum representing splash screens used to highlight specific features to the user';

INSERT INTO "public"."splash_screens"("name") 
VALUES (E'ORGANISATIONS_INSIGHT_REPORTS');

CREATE TABLE "public"."submission_of_splash_screens" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "splash_screen" text NOT NULL,
    "profile_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("splash_screen", "profile_id")
);

COMMENT ON TABLE "public"."submission_of_splash_screens"
    IS E'This table is used to store the user submissions of a splash screen.';

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

CREATE TRIGGER "set_public_submission_of_splash_screens_updated_at"
BEFORE UPDATE ON "public"."submission_of_splash_screens"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_submission_of_splash_screens_updated_at"
ON "public"."submission_of_splash_screens"
    IS 'Trigger to set the value of column "updated_at" to the current timestamp on row update.';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "public"."submission_of_splash_screens"
ADD CONSTRAINT "submission_of_splash_screens_splash_screen_fkey"
FOREIGN KEY ("splash_screen")
REFERENCES "public"."splash_screens"("name")
ON UPDATE RESTRICT
ON DELETE RESTRICT;

ALTER TABLE "public"."submission_of_splash_screens"
    ADD CONSTRAINT "submission_of_splash_screens_profile_id_fkey"
    FOREIGN KEY ("profile_id")
    REFERENCES "public"."profile" ("id")
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

CREATE  INDEX "submission_of_splash_screens_profile_id_idx" on
  "public"."submission_of_splash_screens" using btree ("profile_id");

