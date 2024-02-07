update "profile"
set last_activity = created_at
where last_activity is null;

alter table "public"."profile" alter column "last_activity" set not null;
alter table "public"."profile" alter column "last_activity" set default now();


