CREATE TABLE "public"."course_expense_type" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."course_expense_type" ("name") VALUES ('ACCOMMODATION'), ('TRANSPORT'), ('MISCELLANEOUS');

CREATE TABLE "public"."course_expenses" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "course_id" int4 NOT NULL, "type" text NOT NULL, "description" text NOT NULL, "value" numeric NOT NULL, "trainer_id" uuid NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE  INDEX "course_expenses_course_id" on
  "public"."course_expenses" using btree ("course_id");

CREATE  INDEX "course_expenses_trainer_id" on
  "public"."course_expenses" using btree ("trainer_id");

alter table "public"."course_expenses"
  add constraint "course_expenses_type_fkey"
  foreign key ("type")
  references "public"."course_expense_type"
  ("name") on update cascade on delete restrict;

alter table "public"."course_expenses"
  add constraint "course_expenses_trainer_id_fkey"
  foreign key ("trainer_id")
  references "public"."profile"
  ("id") on update cascade on delete restrict;

alter table "public"."course_expenses"
  add constraint "course_expenses_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update cascade on delete restrict;
