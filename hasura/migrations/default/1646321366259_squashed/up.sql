CREATE TABLE "public"."course_invite_status" ("name" text NOT NULL, PRIMARY KEY ("name"));COMMENT ON TABLE "public"."course_invite_status" IS E'Enums for status of course registration invites';

INSERT INTO "public"."course_invite_status" (name) VALUES
('PENDING'),
('ACCEPTED'),
('DECLINED');

CREATE TABLE "public"."course_invites" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "status" text DEFAULT 'PENDING', "course_id" uuid, "email" text, PRIMARY KEY ("id") , FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("status") REFERENCES "public"."course_invite_status"("name") ON UPDATE cascade ON DELETE restrict);COMMENT ON TABLE "public"."course_invites" IS E'Represents course registration invitations';
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
CREATE TRIGGER "set_public_course_invites_updated_at"
BEFORE UPDATE ON "public"."course_invites"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_invites_updated_at" ON "public"."course_invites" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
