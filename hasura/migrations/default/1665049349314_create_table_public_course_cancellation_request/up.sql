CREATE TABLE "public"."course_cancellation_request" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_id" integer NOT NULL, "requested_by" uuid NOT NULL, "reason" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE no action ON DELETE cascade, FOREIGN KEY ("requested_by") REFERENCES "public"."profile"("id") ON UPDATE no action ON DELETE cascade, UNIQUE ("course_id"));
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
CREATE TRIGGER "set_public_course_cancellation_request_updated_at"
BEFORE UPDATE ON "public"."course_cancellation_request"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_cancellation_request_updated_at" ON "public"."course_cancellation_request" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
