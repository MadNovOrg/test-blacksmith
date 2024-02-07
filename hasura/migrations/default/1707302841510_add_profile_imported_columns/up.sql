
alter table "public"."profile" add column "imported" boolean
 null;

alter table "public"."profile" add column "account_confirmed" boolean
 null;

 update "profile"
 set account_confirmed = true
 where last_activity is not null;
