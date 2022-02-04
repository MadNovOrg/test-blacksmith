
CREATE TABLE "identity_type" (
  "value" text NOT NULL PRIMARY KEY
);

INSERT INTO "identity_type"
  VALUES ('cognito');

CREATE TABLE "profile_status" (
  "value" text NOT NULL PRIMARY KEY
);

INSERT INTO "profile_status"
  VALUES ('active');

CREATE TABLE "organization_status" (
  "value" text NOT NULL PRIMARY KEY
);

INSERT INTO "organization_status"
  VALUES ('active');

CREATE TABLE "profile" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "given_name" varchar NOT NULL,
  "family_name" varchar NOT NULL,
  "title" varchar,
  "tags" jsonb,
  "status" text NOT NULL DEFAULT 'active' REFERENCES "profile_status" ("value"),
  "contact_details" jsonb NOT NULL DEFAULT '[]' ::jsonb,
  "attributes" jsonb NOT NULL DEFAULT '{}' ::jsonb,
  "addresses" jsonb NOT NULL DEFAULT '[]' ::jsonb,
  "preferences" jsonb NOT NULL DEFAULT '{}' ::jsonb,
  "original_record" jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "organization" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "name" varchar NOT NULL,
  "tags" jsonb,
  "status" text NOT NULL DEFAULT 'active' REFERENCES "organization_status" ("value"),
  "contact_details" jsonb NOT NULL DEFAULT '[]' ::jsonb,
  "attributes" jsonb NOT NULL DEFAULT '{}' ::jsonb,
  "addresses" jsonb NOT NULL DEFAULT '[]' ::jsonb,
  "preferences" jsonb NOT NULL DEFAULT '{}' ::jsonb,
  "original_record" jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "role" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "name" varchar NOT NULL UNIQUE,
  "data" jsonb NOT NULL DEFAULT '{}' ::jsonb
);

CREATE TABLE "profile_role" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "profile_id" uuid NOT NULL REFERENCES "profile" ("id") ON DELETE CASCADE,
  "role_id" uuid NOT NULL REFERENCES "role" ("id") ON DELETE NO ACTION,
  "_source" varchar,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE ("profile_id", "role_id")
);

CREATE INDEX "profile_role_profile_id_idx" ON "profile_role" ("profile_id");

CREATE TABLE "organization_role" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "organization_id" uuid NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
  "role_id" uuid NOT NULL REFERENCES "role" ("id") ON DELETE NO ACTION,
  "_source" varchar,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE ("role_id", "organization_id")
);

CREATE TABLE "organization_member" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "profile_id" uuid NOT NULL REFERENCES "profile" ("id") ON DELETE CASCADE,
  "organization_role_id" uuid NOT NULL REFERENCES "organization_role" ("id") ON DELETE NO ACTION,
  "member_type" varchar,
  "_source" varchar,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE ("profile_id", "organization_role_id")
);

CREATE INDEX "organization_member_profile_id_idx" ON "organization_member" ("profile_id");

CREATE TABLE "organization_group" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "organization_id" uuid NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
  "parent_organization_id" uuid NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
  "_source" varchar,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE ("organization_id", "parent_organization_id")
);

CREATE TABLE "identity" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "provider_id" varchar NOT NULL UNIQUE,
  "profile_id" uuid NOT NULL REFERENCES "profile" ("id") ON DELETE CASCADE,
  "type" text NOT NULL REFERENCES "identity_type" ("value")
);

CREATE OR REPLACE FUNCTION updated_at_field ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_profile_updated_at
  BEFORE UPDATE ON "profile"
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at_field ();

CREATE TRIGGER trigger_organization_updated_at
  BEFORE UPDATE ON "organization"
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at_field ();

CREATE TRIGGER trigger_organization_member_updated_at
  BEFORE UPDATE ON "organization_member"
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at_field ();

CREATE TRIGGER trigger_profile_role_updated_at
  BEFORE UPDATE ON "profile_role"
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at_field ();

CREATE TRIGGER trigger_organization_role_updated_at
  BEFORE UPDATE ON "organization_role"
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at_field ();


alter table "public"."organization_member" rename column "organization_role_id" to "organization_id";

alter table "public"."organization_member" drop constraint "organization_member_profile_id_organization_role_id_key";

alter table "public"."organization_member" add constraint "organization_member_profile_id_organization_id_key" unique ("profile_id", "organization_id");

DROP INDEX IF EXISTS "public"."organization_member_profile_id_organization_role_id_key";

alter table "public"."organization_member" rename to "organization_member_role";

alter table "public"."organization_member_role" rename column "organization_id" to "organization_member_id";

alter table "public"."organization_member_role" rename column "organization_member_id" to "organization_id";

alter table "public"."organization_member_role" drop constraint "organization_member_organization_role_id_fkey",
  add constraint "organization_member_role_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization_role"
  ("id") on update no action on delete no action;

CREATE TABLE "public"."organization_memeber_role" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "organization_member_id" uuid NOT NULL, "organization_role_id" uuid NOT NULL, "created_at" timestamptz NOT NULL, PRIMARY KEY ("id") , UNIQUE ("organization_member_id", "organization_role_id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."organization_memeber_role" alter column "created_at" set default now();

alter table "public"."organization_memeber_role" add column "updated_at" timestamptz
 null default now();

alter table "public"."organization_member_role" rename to "organization_member";

alter table "public"."organization_role" drop constraint "organization_role_organization_id_fkey",
  add constraint "organization_role_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization"
  ("id") on update cascade on delete cascade;

alter table "public"."organization_memeber_role" rename to "organization_member_role";

alter table "public"."organization_member_role"
  add constraint "organization_member_role_organization_member_id_fkey"
  foreign key ("organization_member_id")
  references "public"."organization_member"
  ("id") on update cascade on delete cascade;

alter table "public"."organization_member_role"
  add constraint "organization_member_role_organization_role_id_fkey"
  foreign key ("organization_role_id")
  references "public"."organization_role"
  ("id") on update no action on delete no action;

alter table "public"."organization_member_role" add column "_source" varchar
 null;

CREATE TRIGGER trigger_organization_member_role_updated_at
  BEFORE UPDATE ON "organization_member_role"
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at_field ();

DROP TABLE "organization_member" CASCADE;

CREATE TABLE "organization_member" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
  "profile_id" uuid NOT NULL REFERENCES "profile" ("id") ON DELETE CASCADE,
  "organization_id" uuid NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
  "member_type" varchar,
  "_source" varchar,
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  "updated_at" timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE ("profile_id", "organization_id")
);

CREATE INDEX "organization_member_profile_id_idx" ON "organization_member" ("profile_id");

alter table "public"."organization_member_role"
  add constraint "organization_member_role_organization_member_id_fkey"
  foreign key ("organization_member_id")
  references "public"."organization_member"
  ("id") on update cascade on delete cascade;

CREATE TABLE "public"."course" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "course_type" text NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_course_updated_at"
BEFORE UPDATE ON "public"."course"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_updated_at" ON "public"."course" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."course_type" ("name" Text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."course_type"("name") VALUES (E'open');

INSERT INTO "public"."course_type"("name") VALUES (E'closed');

INSERT INTO "public"."course_type"("name") VALUES (E'indirect');

alter table "public"."course"
  add constraint "course_course_type_fkey"
  foreign key ("course_type")
  references "public"."course_type"
  ("name") on update no action on delete set null;

alter table "public"."course" drop constraint "course_course_type_fkey",
  add constraint "course_course_type_fkey"
  foreign key ("course_type")
  references "public"."course_type"
  ("name") on update no action on delete restrict;

CREATE TABLE "public"."module" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text, "module_level" integer NOT NULL, "module_medium" text NOT NULL, "module_category" text NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_module_updated_at"
BEFORE UPDATE ON "public"."module"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_module_updated_at" ON "public"."module" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."module_medium" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."module_medium"("name") VALUES (E'WEBINAR');

INSERT INTO "public"."module_medium"("name") VALUES (E'ELEARNING');

INSERT INTO "public"."module_medium"("name") VALUES (E'PHYSICAL');

alter table "public"."module"
  add constraint "module_module_medium_fkey"
  foreign key ("module_medium")
  references "public"."module_medium"
  ("name") on update cascade on delete restrict;

CREATE TABLE "public"."module_category" ("name" Text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."module_category"("name") VALUES (E'PHYSICAL');

INSERT INTO "public"."module_category"("name") VALUES (E'THEORY');

alter table "public"."module"
  add constraint "module_module_category_fkey"
  foreign key ("module_category")
  references "public"."module_category"
  ("name") on update cascade on delete restrict;

CREATE TABLE "public"."course_module" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "course_id" uuid NOT NULL, "module_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON UPDATE cascade ON DELETE restrict, FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE cascade ON DELETE restrict);
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
CREATE TRIGGER "set_public_course_module_updated_at"
BEFORE UPDATE ON "public"."course_module"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_module_updated_at" ON "public"."course_module" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."venue" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "address" jsonb NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_venue_updated_at"
BEFORE UPDATE ON "public"."venue"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_venue_updated_at" ON "public"."venue" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."module_group" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_module_group_updated_at"
BEFORE UPDATE ON "public"."module_group"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_module_group_updated_at" ON "public"."module_group" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."module" add column "module_group_id" uuid
 null;

alter table "public"."module"
  add constraint "module_module_group_id_fkey"
  foreign key ("module_group_id")
  references "public"."module_group"
  ("id") on update cascade on delete restrict;

alter table "public"."module_group" add column "module_level" integer
 null;

alter table "public"."module" drop constraint "module_module_medium_fkey";

alter table "public"."module" drop column "module_medium" cascade;
