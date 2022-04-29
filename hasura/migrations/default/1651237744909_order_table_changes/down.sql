
alter table "public"."order" alter column "vat" set not null;

alter table "public"."order" alter column "order_total" set not null;

alter table "public"."order" alter column "price" set not null;

alter table "public"."order" drop constraint "order_organization_id_fkey";

alter table "public"."order" drop column "organization_id";
