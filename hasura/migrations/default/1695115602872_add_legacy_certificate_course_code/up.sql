truncate public.legacy_certificate;

alter table "public"."legacy_certificate" add column "course_code" text
    not null;
