alter table "public"."venue" drop column "city";
alter table "public"."venue" drop column "address_line_one";
alter table "public"."venue" drop column "address_line_two";
alter table "public"."venue" drop column "post_code";

alter table "public"."venue" add column "address" jsonb not null default '{}' ::jsonb