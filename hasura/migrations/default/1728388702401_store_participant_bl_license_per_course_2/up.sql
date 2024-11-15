
ALTER TABLE "public"."go1_licenses" 
DROP CONSTRAINT IF EXISTS "go1_licenses_profile_id_org_id_key";

ALTER TABLE "public"."go1_licenses" 
ADD COLUMN "course_id" INTEGER 
NULL;

ALTER TABLE "public"."go1_licenses" 
ADD CONSTRAINT "go1_licenses_course_id_fkey" 
FOREIGN KEY ("course_id") 
REFERENCES "public"."course" ("id") 
ON UPDATE CASCADE 
ON DELETE RESTRICT;

ALTER TABLE "public"."go1_licenses" 
ADD CONSTRAINT "go1_licenses_profile_id_course_id_key" 
UNIQUE ("profile_id", "course_id");
