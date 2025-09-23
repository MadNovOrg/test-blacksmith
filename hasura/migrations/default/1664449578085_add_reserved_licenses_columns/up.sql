
alter table "public"."organization" add column "reserved_go1_licenses" integer
 null;

alter table "public"."go1_licenses_history" add column "reserved_balance" integer
 not null default '0';
