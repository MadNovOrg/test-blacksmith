alter table "public"."order_temp" add column "source" text null;
alter table "public"."order_temp" add column "sales_representative_id" uuid null;
alter table "public"."order_temp" add column "booking_contact" jsonb null;
