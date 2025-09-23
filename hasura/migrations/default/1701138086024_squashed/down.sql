
comment on column "public"."course_pricing_schedule"."price_amount" is NULL;

alter table "public"."course_pricing_schedule" drop constraint "course_pricing_schedule_course_pricing_id_fkey";

DROP TABLE "public"."course_pricing_schedule";
