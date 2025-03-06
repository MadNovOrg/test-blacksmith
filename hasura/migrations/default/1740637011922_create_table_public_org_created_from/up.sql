CREATE TABLE "public"."org_created_from" ("name" text NOT NULL, PRIMARY KEY ("name") );
INSERT INTO "public"."org_created_from"("name") VALUES 
(E'ORGANISATION_PAGE'),
(E'EDIT_PROFILE_PAGE'),
(E'ONBOARDING_PAGE'),
(E'AUTOREGISTER_PAGE'),
(E'CREATE_COURSE_PAGE'),
(E'BOOKING_PAGE'),
(E'INVOICE_DETAILS_PAGE'),
(E'REGISTER_PAGE');


CREATE TABLE "public"."cud_operation" ("name" text NOT NULL, PRIMARY KEY ("name") );
INSERT INTO "public"."cud_operation"("name") VALUES 
(E'CREATE'),
(E'UPDATE'),
(E'DELETE');

CREATE TABLE "public"."organisation_log" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "organisation_id" uuid, "actioned_by" uuid, "actioned_at" timestamp NOT NULL DEFAULT now(), "actioned_from" text NOT NULL, "operation" text NOT NULL, "updated_columns" jsonb, PRIMARY KEY ("id") , FOREIGN KEY ("organisation_id") REFERENCES "public"."organization"("id") ON UPDATE no action ON DELETE SET NULL, FOREIGN KEY ("actioned_by") REFERENCES "public"."profile"("id") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("actioned_from") REFERENCES "public"."org_created_from"("name") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("operation") REFERENCES "public"."cud_operation"("name") ON UPDATE restrict ON DELETE restrict);COMMENT ON TABLE "public"."organisation_log" IS E'Keep track of changes made on organisations';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
