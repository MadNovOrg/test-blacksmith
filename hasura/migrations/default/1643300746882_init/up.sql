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

