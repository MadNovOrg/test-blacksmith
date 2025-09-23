alter table "public"."profile" alter COLUMN "last_activity" drop default;
alter table "public"."profile" alter column "last_activity" drop not null;

update profile
set last_activity = null
where created_at = last_activity;