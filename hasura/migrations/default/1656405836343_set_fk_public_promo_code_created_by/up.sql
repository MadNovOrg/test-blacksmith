alter table "public"."promo_code"
  add constraint "promo_code_created_by_fkey"
  foreign key ("created_by")
  references "public"."profile"
  ("id") on update restrict on delete restrict;

alter table "public"."promo_code"
  add constraint "promo_code_approved_by_fkey"
  foreign key ("approved_by")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
