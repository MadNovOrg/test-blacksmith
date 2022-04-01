alter table "public"."course" add column "go1integration" boolean
 not null default 'false';

alter table "public"."course" add column "aol_cost_of_course" numeric
    null;

alter table "public"."course_schedule" add column "virtual_link" text
    null;

