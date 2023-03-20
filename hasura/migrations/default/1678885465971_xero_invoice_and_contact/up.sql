
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."xero_invoice_status" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO xero_invoice_status (name) VALUES
  ('DRAFT'),
  ('SUBMITTED'),
  ('DELETED'),
  ('AUTHORISED'),
  ('PAID'),
  ('VOIDED');

CREATE TABLE "public"."xero_contact" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
  "xero_id" text NOT NULL, 
  "name" text, 
  "first_name" text NOT NULL, 
  "last_name" text NOT NULL, 
  "email_address" text, 
  "addresses" jsonb, 
  "phones" jsonb, 
  PRIMARY KEY ("id") , 
  UNIQUE ("xero_id"));
COMMENT ON TABLE "public"."xero_contact" IS E'Xero contact stored on our end, and synced from Xero';

CREATE TABLE "public"."xero_invoice" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
  "xero_id" text NOT NULL, 
  "invoice_number" text NOT NULL, 
  "xero_contact_id" text not null, 
  "line_items" jsonb NOT NULL, 
  "total" numeric NOT NULL, 
  "total_tax" numeric NOT NULL, 
  "subtotal" numeric NOT NULL, 
  "amount_due" numeric,
  "amount_paid" numeric, 
  "fully_paid_on_date" timestamp, 
  "due_date" timestamp NOT NULL, 
  "issued_date" timestamp NOT NULL, 
  "reference" text NOT NULL, 
  "currency_code" text NOT NULL, 
  "status" text NOT NULL,
  PRIMARY KEY ("id"), 
  UNIQUE ("xero_id"), 
  UNIQUE ("invoice_number"));
COMMENT ON TABLE "public"."xero_invoice" IS E'Invoice stored on our end, and synced from Xero';

alter table "public"."xero_invoice"
  add constraint "xero_invoice_xero_contact_id_fkey"
  foreign key ("xero_contact_id")
  references "public"."xero_contact"
  ("xero_id") on update cascade on delete restrict;

alter table "public"."xero_invoice"
  add constraint "xero_invoice_status_fkey"
  foreign key ("status")
  references "public"."xero_invoice_status"
  ("name") on update restrict on delete restrict;

alter table "public"."order" add constraint "order_xero_invoice_number_key" unique ("xero_invoice_number");

alter table "public"."xero_invoice"
  add constraint "xero_invoice_invoice_number_fkey"
  foreign key ("invoice_number")
  references "public"."order"
  ("xero_invoice_number") on update restrict on delete restrict;
