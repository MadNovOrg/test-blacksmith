

alter table "public"."course" drop constraint "course_course_cancellation_fee_type_fkey";

alter table "public"."course" drop column "cancellation_fee_type";


DELETE FROM "public"."course_cancellation_fee_type" WHERE "name" = 'NO_FEES';

DELETE FROM "public"."course_cancellation_fee_type" WHERE "name" = 'CUSTOM_FEE';

DELETE FROM "public"."course_cancellation_fee_type" WHERE "name" = 'APPLY_CANCELLATION_TERMS';

DROP TABLE "public"."course_cancellation_fee_type";

alter table "public"."course" rename column "cancellation_fee" to "cancellation_fee_percent";
ALTER TABLE "public"."course" ALTER COLUMN "cancellation_fee_percent" TYPE integer;
