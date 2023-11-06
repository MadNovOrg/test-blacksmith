
ALTER TABLE "public"."course_certificate" ALTER COLUMN "course_accredited_by" drop default;

ALTER TABLE "public"."course_certificate" ALTER COLUMN "blended_learning" drop default;

alter table "public"."course_certificate" alter column "reaccreditation" set not null;
ALTER TABLE "public"."course_certificate" ALTER COLUMN "reaccreditation" drop default;

alter table "public"."course_certificate" alter column "course_accredited_by" set not null;

alter table "public"."course_certificate" alter column "blended_learning" set not null;
