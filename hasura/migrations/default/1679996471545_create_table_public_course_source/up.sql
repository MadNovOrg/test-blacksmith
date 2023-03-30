CREATE TABLE "public"."course_source" ("name" text NOT NULL, PRIMARY KEY ("name") );COMMENT ON TABLE "public"."course_source" IS E'Enum table for different course sales sources';

INSERT INTO "public"."course_source" VALUES 
  ('EMAIL_ENQUIRY'),
  ('EMAIL_ENQUIRY_CENTRAL'),
  ('EVENT'),
  ('EXISTING_CLIENT'),
  ('MARKETING_CAMPAIGN'),
  ('NDIS'),
  ('SALES_CALL'),
  ('SALES_MAILER'),
  ('TELEPHONE_ENQUIRY'),
  ('TENDER');