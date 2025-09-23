alter table "public"."go1_licenses" add column "enrolled_on" timestamptz
 not null default now();
