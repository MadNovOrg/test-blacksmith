alter table "public"."legacy_certificate" drop constraint "legacy_certificate_course_certificate_id_fkey";

alter table "public"."legacy_certificate" drop column "course_certificate_id";
