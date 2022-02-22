alter table "public"."course" drop constraint "course_course_delivery_type_fkey";

alter table "public"."course" drop column "course_delivery_type";

drop table "public"."course_delivery_type";

