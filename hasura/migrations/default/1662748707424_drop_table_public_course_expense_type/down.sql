CREATE TABLE "public"."course_expense_type" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."course_expense_type" ("name") VALUES ('ACCOMMODATION'), ('TRANSPORT'), ('MISCELLANEOUS');
