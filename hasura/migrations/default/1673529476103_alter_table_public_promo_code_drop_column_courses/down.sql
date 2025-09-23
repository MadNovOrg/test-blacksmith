alter table "public"."promo_code" add column "courses" jsonb;
alter table "public"."promo_code" alter column "courses" set default '[]'::jsonb;
alter table "public"."promo_code" alter column "courses" drop not null;
