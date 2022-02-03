CREATE TABLE "public"."organization_memeber_role" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "organization_member_id" uuid NOT NULL, "organization_role_id" uuid NOT NULL, "created_at" timestamptz NOT NULL, PRIMARY KEY ("id") , UNIQUE ("organization_member_id", "organization_role_id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
