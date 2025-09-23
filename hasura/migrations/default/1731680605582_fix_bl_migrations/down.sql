DROP FUNCTION IF EXISTS public.course_reserved_go1_licenses(course);

ALTER TABLE "public"."order"
DROP COLUMN IF EXISTS "invitees";
