
CREATE TABLE "public"."course_pricing_schedule" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_pricing_id" uuid NOT NULL, "effective_from" date NOT NULL, "effective_to" date NOT NULL, "price_amount" numeric NOT NULL, "price_currency" text NOT NULL DEFAULT 'GBP', PRIMARY KEY ("id") );COMMENT ON TABLE "public"."course_pricing_schedule" IS E'Schedules for course pricing per participant';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."course_pricing_schedule"
  add constraint "course_pricing_schedule_course_pricing_id_fkey"
  foreign key ("course_pricing_id")
  references "public"."course_pricing"
  ("id") on update restrict on delete restrict;

comment on column "public"."course_pricing_schedule"."price_amount" is E'Price per participant without any discounts';
