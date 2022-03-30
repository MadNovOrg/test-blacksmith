alter table "public"."venue"
    add column "city" text null;
alter table "public"."venue"
    add column "address_line_one" text null;
alter table "public"."venue"
    add column "address_line_two" text null;
alter table "public"."venue"
    add column "post_code" text null;

update "public"."venue"
set city             = address ->> 'city',
    address_line_one = address ->> 'addressLineTwo',
    address_line_two = address ->> 'addressLineTwo',
    post_code        = 'unknown';

alter table "public"."venue"
    alter column "city" set not null;
alter table "public"."venue"
    alter column "address_line_one" set not null;
alter table "public"."venue"
    alter column "post_code" set not null;

alter table "public"."venue" drop column "address" cascade;