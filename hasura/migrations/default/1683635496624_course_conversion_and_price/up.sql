
alter table "public"."course" add column "conversion" boolean
 null default 'false';

alter table "public"."course" add column "price" numeric
 null;

alter table "public"."course" add column "price_currency" text
 null default 'GBP';
