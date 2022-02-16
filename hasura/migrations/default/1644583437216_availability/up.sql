
CREATE TABLE "public"."availability_type" ("value" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));

INSERT INTO "availability_type" VALUES 
    ('available'),
    ('unavailable'),
    ('annual_leave'),
    ('sick_leave'),
    ('compassionate_leave');

CREATE TABLE "public"."availability" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "start" timestamptz NOT NULL, "end" timestamptz NOT NULL, "description" text, "type" text NOT NULL, "profile_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_availability_updated_at"
BEFORE UPDATE ON "public"."availability"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_availability_updated_at" ON "public"."availability" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."availability"
    add constraint "availability_type_fkey"
        foreign key ("type")
            references "public"."availability_type"
                ("value") on update restrict on delete restrict;

