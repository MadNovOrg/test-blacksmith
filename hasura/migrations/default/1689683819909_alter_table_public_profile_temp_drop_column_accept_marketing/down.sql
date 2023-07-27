alter table "public"."profile_temp" add column "accept_marketing" bool;
alter table "public"."profile_temp" alter column "accept_marketing" set not null;
comment on column "public"."profile_temp"."accept_marketing" is E'Contains partial temporary profiles until account in cognito is confirmed';
