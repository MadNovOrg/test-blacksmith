alter table "public"."order" add column "user" jsonb
 not null default '{}';

ALTER TABLE "public"."order" ALTER COLUMN "user" drop default;

alter table "public"."order" drop constraint "order_profile_id_fkey",
  add constraint "order_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete no action;
