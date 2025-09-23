
alter table "public"."course_expenses" add column "type" text not null;

alter table "public"."course_expenses"
  add constraint "course_expenses_type_fkey"
  foreign key ("type")
  references "public"."course_expense_type"
  ("name") on update cascade on delete restrict;

alter table "public"."course_expenses" add column "value" numeric not null;

alter table "public"."course_expenses" add column "description" text not null;

alter table "public"."course_expenses" drop column "data" cascade;
