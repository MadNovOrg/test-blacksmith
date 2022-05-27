alter table "public"."organization" alter column "addresses" set default '{}'::jsonb;
alter table "public"."organization" rename column "addresses" to "address";
