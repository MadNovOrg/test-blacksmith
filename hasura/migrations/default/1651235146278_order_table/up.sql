
CREATE TABLE "public"."order" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_id" integer NOT NULL, "profile_id" uuid NOT NULL, "quantity" integer NOT NULL, "payment_method" text NOT NULL, "billing_address" text NOT NULL, "billing_given_name" text NOT NULL, "billing_family_name" text NOT NULL, "billing_email" text NOT NULL, "billing_phone" text NOT NULL, "registrants" json NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "price" float8 NOT NULL, "vat" double precision NOT NULL, "order_total" float8 NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE restrict ON DELETE restrict);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."payment_methods" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."payment_methods"("name") VALUES (E'CC');

INSERT INTO "public"."payment_methods"("name") VALUES (E'INVOICE');

alter table "public"."order"
  add constraint "order_payment_method_fkey"
  foreign key ("payment_method")
  references "public"."payment_methods"
  ("name") on update cascade on delete restrict;
