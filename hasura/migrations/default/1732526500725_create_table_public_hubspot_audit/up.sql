CREATE TABLE "public"."hubspot_audit" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "profile_id" uuid NOT NULL, "error" jsonb, PRIMARY KEY ("id") , FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));COMMENT ON TABLE "public"."hubspot_audit" IS E'This table stores hubspot related logs';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."hubspot_audit" add column "hubspot_cookie" text
 not null;

alter table "public"."hubspot_audit" add column "page_details" jsonb
 null;

alter table "public"."hubspot_audit" add column "created_at" timestamptz
 not null default now();

 alter table "public"."hubspot_audit" add column "status" text
 not null;

  alter table "public"."hubspot_audit" add column "authentication_mode" text
 not null;


