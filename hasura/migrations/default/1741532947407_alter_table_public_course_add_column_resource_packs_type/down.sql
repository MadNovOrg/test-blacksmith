ALTER TABLE "public"."course" 
DROP CONSTRAINT "course_resource_packs_type_fkey";

ALTER TABLE "public"."course" 
DROP COLUMN IF EXISTS "resource_packs_type";
