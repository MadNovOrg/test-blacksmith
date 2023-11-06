
alter table "public"."course_certificate" drop constraint "course_certificate_course_accredited_by_fkey";

alter table "public"."course_certificate" drop column "reaccreditation";
alter table "public"."course_certificate" drop column "blended_learning";
alter table "public"."course_certificate" drop column "course_accredited_by";
