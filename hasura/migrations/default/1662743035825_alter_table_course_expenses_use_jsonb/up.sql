
alter table "public"."course_expenses" add column "data" jsonb
 not null;

alter table "public"."course_expenses" drop column "description" cascade;

alter table "public"."course_expenses" drop column "value" cascade;

alter table "public"."course_expenses"
  drop constraint "course_expenses_type_fkey" cascade;

alter table "public"."course_expenses" drop column "type" cascade;
