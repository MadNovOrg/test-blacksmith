alter table "public"."promo_code" add column "denied_by" uuid null;

alter table "public"."promo_code"
  add constraint "promo_code_denied_by_fkey"
  foreign key ("denied_by")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
