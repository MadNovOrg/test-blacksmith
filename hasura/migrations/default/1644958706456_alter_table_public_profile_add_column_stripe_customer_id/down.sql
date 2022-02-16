-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."profile" add column "stripe_customer_id" varchar
--  null unique;

alter table "public"."profile" drop column "stripe_customer_id";
