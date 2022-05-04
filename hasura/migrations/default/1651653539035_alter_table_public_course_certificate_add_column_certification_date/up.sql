alter table "public"."course_certificate" add column "certification_date" date
 null;

update "public"."course_certificate" set "certification_date" = "created_at";

alter table "public"."course_certificate" alter column "certification_date" set not null;
