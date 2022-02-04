
alter table "public"."module" alter column "module_medium" drop not null;
alter table "public"."module" add column "module_medium" text;

alter table "public"."module"
  add constraint "module_module_medium_fkey"
  foreign key ("module_medium")
  references "public"."module_medium"
  ("name") on update cascade on delete restrict;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."module_group" add column "module_level" integer
--  null;

alter table "public"."module" drop constraint "module_module_group_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."module" add column "module_group_id" uuid
--  null;

DROP TABLE "public"."module_group";

DROP TABLE "public"."venue";

DROP TABLE "public"."course_module";

alter table "public"."module" drop constraint "module_module_category_fkey";

DELETE FROM "public"."module_category" WHERE "name" = 'THEORY';

DELETE FROM "public"."module_category" WHERE "name" = 'PHYSICAL';

DROP TABLE "public"."module_category";

alter table "public"."module" drop constraint "module_module_medium_fkey";

DELETE FROM "public"."module_medium" WHERE "name" = 'PHYSICAL';

DELETE FROM "public"."module_medium" WHERE "name" = 'ELEARNING';

DELETE FROM "public"."module_medium" WHERE "name" = 'WEBINAR';

DROP TABLE "public"."module_medium";

DROP TABLE "public"."module";

alter table "public"."course" drop constraint "course_course_type_fkey",
  add constraint "course_course_type_fkey"
  foreign key ("course_type")
  references "public"."course_type"
  ("name") on update no action on delete set null;

alter table "public"."course" drop constraint "course_course_type_fkey";

DELETE FROM "public"."course_type" WHERE "name" = 'indirect';

DELETE FROM "public"."course_type" WHERE "name" = 'closed';

DELETE FROM "public"."course_type" WHERE "name" = 'open';

DROP TABLE "public"."course_type";

DROP TABLE "public"."course";

alter table "public"."organization_member_role" drop constraint "organization_member_role_organization_member_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TABLE "organization_member" (
--   "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
--   "profile_id" uuid NOT NULL REFERENCES "profile" ("id") ON DELETE CASCADE,
--   "organization_id" uuid NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
--   "member_type" varchar,
--   "_source" varchar,
--   "created_at" timestamptz NOT NULL DEFAULT NOW(),
--   "updated_at" timestamptz NOT NULL DEFAULT NOW(),
--   UNIQUE ("profile_id", "organization_id")
-- );
--
-- CREATE INDEX "organization_member_profile_id_idx" ON "organization_member" ("profile_id");

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TRIGGER trigger_organization_member_role_updated_at
--   BEFORE UPDATE ON "organization_member_role"
--   FOR EACH ROW
--   EXECUTE PROCEDURE updated_at_field ();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."organization_member_role" add column "_source" varchar
--  null;

alter table "public"."organization_member_role" drop constraint "organization_member_role_organization_role_id_fkey";

alter table "public"."organization_member_role" drop constraint "organization_member_role_organization_member_id_fkey";

alter table "public"."organization_member_role" rename to "organization_memeber_role";

alter table "public"."organization_role" drop constraint "organization_role_organization_id_fkey",
  add constraint "organization_role_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization"
  ("id") on update no action on delete cascade;

alter table "public"."organization_member" rename to "organization_member_role";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."organization_memeber_role" add column "updated_at" timestamptz
--  null default now();

ALTER TABLE "public"."organization_memeber_role" ALTER COLUMN "created_at" drop default;

DROP TABLE "public"."organization_memeber_role";

alter table "public"."organization_member_role" drop constraint "organization_member_role_organization_id_fkey",
  add constraint "organization_member_organization_role_id_fkey"
  foreign key ("organization_id")
  references "public"."organization_role"
  ("id") on update no action on delete no action;

alter table "public"."organization_member_role" rename column "organization_id" to "organization_member_id";

alter table "public"."organization_member_role" rename column "organization_member_id" to "organization_id";

alter table "public"."organization_member_role" rename to "organization_member";

CREATE  INDEX "organization_member_profile_id_organization_role_id_key" on
  "public"."organization_member" using btree ("organization_id", "profile_id");

alter table "public"."organization_member" drop constraint "organization_member_profile_id_organization_id_key";

alter table "public"."organization_member" add constraint "organization_member_profile_id_organization_id_key" unique ("profile_id", "organization_id");

alter table "public"."organization_member" rename column "organization_id" to "organization_role_id";

DROP TRIGGER trigger_profile_updated_at ON "profile";

DROP TRIGGER trigger_organization_updated_at ON "organization";

DROP TRIGGER trigger_organization_member_updated_at ON "organization_member";

DROP TRIGGER trigger_profile_role_updated_at ON "profile_role";

DROP TRIGGER trigger_organization_role_updated_at ON "organization_role";

DROP FUNCTION updated_at_field CASCADE;

DROP TABLE "identity_type";

DROP TABLE "profile_status";

DROP TABLE "organization_status";

DROP TABLE "profile_role";

DROP TABLE "organization_member";

DROP TABLE "organization_role";

DROP TABLE "organization_group";

DROP TABLE "identity";

DROP TABLE "profile";

DROP TABLE "organization";

DROP TABLE "role";
