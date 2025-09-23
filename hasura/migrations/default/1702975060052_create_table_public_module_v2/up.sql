CREATE TABLE "public"."module_v2" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
    "name" text NOT NULL, 
    "display_name" text,
    "lessons" jsonb NOT NULL, 
    "created_at" timestamptz NOT NULL DEFAULT now(), 
    "updated_at" timestamptz NOT NULL DEFAULT now(), 
    PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("name"));COMMENT ON TABLE "public"."module_v2" IS E'Holds information about modules with their lessons';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
