alter table "public"."organization" rename column "address" to "addresses";
alter table "public"."organization" alter column "addresses" set default '[]'::jsonb;
