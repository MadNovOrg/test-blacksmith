alter table "public"."organization" add column "sector" text null;
alter table "public"."organization" add column "region" text null;
alter table "public"."organization" add column "last_activity" timestamptz null;
