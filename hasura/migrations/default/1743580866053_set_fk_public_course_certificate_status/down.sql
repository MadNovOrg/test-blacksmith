alter table "public"."course_certificate" drop constraint "course_certificate_status_fkey";

DELETE FROM "public"."certificate_status" WHERE "name" = 'INACTIVE';
DELETE FROM "public"."certificate_status" WHERE "name" = 'ON_HOLD';
