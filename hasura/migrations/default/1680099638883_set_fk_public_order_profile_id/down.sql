alter table "public"."order" drop constraint "order_profile_id_fkey",
  add constraint "order_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete no action;
