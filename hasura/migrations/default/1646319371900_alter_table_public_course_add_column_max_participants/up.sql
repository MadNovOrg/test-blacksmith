alter table "public"."course" add column "min_participants" integer not null default 6;
alter table "public"."course" add column "max_participants" integer not null default 12;
