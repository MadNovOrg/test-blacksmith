
alter table "public"."course" drop constraint "course_course_status_fkey";

alter table "public"."course" drop column "course_status";

alter table "public"."course" add column "submitted" bool;

DELETE FROM "public"."course_status" WHERE "name" = 'PUBLISHED';

DELETE FROM "public"."course_status" WHERE "name" = 'DRAFT';

DELETE FROM "public"."course_status" WHERE "name" = 'PENDING';

DROP TABLE "public"."course_status";
