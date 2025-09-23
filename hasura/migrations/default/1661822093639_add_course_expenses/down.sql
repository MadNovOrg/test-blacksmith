alter table "public"."course_expenses" drop constraint "course_expenses_course_id_fkey";

alter table "public"."course_expenses" drop constraint "course_expenses_trainer_id_fkey";

alter table "public"."course_expenses" drop constraint "course_expenses_type_fkey";

DROP INDEX IF EXISTS "public"."course_expenses_trainer_id";

DROP INDEX IF EXISTS "public"."course_expenses_course_id";

DROP TABLE "public"."course_expenses";

DROP TABLE "public"."course_expense_type";
