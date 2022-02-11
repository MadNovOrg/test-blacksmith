

CREATE TABLE "public"."course_schedule" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "type" text NOT NULL, "start" timestamptz NOT NULL, "end" timestamptz NOT NULL, "course_id" uuid NOT NULL, "venue_id" uuid NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_course_schedule_updated_at"
BEFORE UPDATE ON "public"."course_schedule"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_schedule_updated_at" ON "public"."course_schedule" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."course_schedule"
  add constraint "course_schedule_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update restrict on delete restrict;

alter table "public"."course_schedule"
  add constraint "course_schedule_venue_id_fkey"
  foreign key ("venue_id")
  references "public"."venue"
  ("id") on update restrict on delete restrict;

alter table "public"."course_schedule"
  add constraint "course_schedule_type_fkey"
  foreign key ("type")
  references "public"."module_medium"
  ("name") on update restrict on delete restrict;

CREATE TABLE "public"."course_participant" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "registration_id" uuid NOT NULL, "course_id" uuid NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."course_participant"
  add constraint "course_participant_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update restrict on delete restrict;

CREATE TABLE "public"."course_team" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "profile_id" uuid NOT NULL, "course_id" uuid NOT NULL, "type" text NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."course_team"
  add constraint "course_team_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;

alter table "public"."course_team"
  add constraint "course_team_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update restrict on delete restrict;
