
ALTER TABLE "public"."course" ALTER COLUMN "cancellation_fee_percent" TYPE float4;
alter table "public"."course" rename column "cancellation_fee_percent" to "cancellation_fee";

CREATE TABLE "public"."course_cancellation_fee_type" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."course_cancellation_fee_type"("name") VALUES (E'APPLY_CANCELLATION_TERMS');

INSERT INTO "public"."course_cancellation_fee_type"("name") VALUES (E'CUSTOM_FEE');

INSERT INTO "public"."course_cancellation_fee_type"("name") VALUES (E'NO_FEES');

alter table "public"."course" add column "cancellation_fee_type" text
 null;

alter table "public"."course"
  add constraint "course_course_cancellation_fee_type_fkey"
  foreign key ("cancellation_fee_type")
  references "public"."course_cancellation_fee_type"
  ("name") on update cascade on delete restrict;

