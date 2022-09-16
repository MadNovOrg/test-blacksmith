
CREATE TABLE "public"."course_draft" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "profile_id" uuid NOT NULL, "course_type" text NOT NULL, "data" jsonb, "created_at" timestamp NOT NULL DEFAULT now(), "updated_at" timestamp NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));COMMENT ON TABLE "public"."course_draft" IS E'Stores course drafts';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."course_draft" add constraint "course_draft_profile_id_course_type_key" unique ("profile_id", "course_type");
