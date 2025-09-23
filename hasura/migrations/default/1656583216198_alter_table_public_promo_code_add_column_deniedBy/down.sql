alter table "public"."promo_code" drop constraint "promo_code_denied_by_fkey";
alter table "public"."promo_code" drop column "denied_by";
