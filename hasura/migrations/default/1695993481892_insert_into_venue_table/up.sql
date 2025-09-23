alter table "public"."venue" add column "country" text
  null;

alter table "public"."venue" alter column "country" set default 'England';