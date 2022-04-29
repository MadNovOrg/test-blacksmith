
alter table "public"."order" add column "organization_id" uuid
 not null;

alter table "public"."order"
  add constraint "order_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization"
  ("id") on update restrict on delete restrict;

alter table "public"."order" alter column "price" drop not null;

alter table "public"."order" alter column "order_total" drop not null;

alter table "public"."order" alter column "vat" drop not null;
