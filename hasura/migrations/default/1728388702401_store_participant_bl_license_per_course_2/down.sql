
ALTER TABLE "public"."go1_licenses" 
DROP CONSTRAINT IF EXISTS "go1_licenses_profile_id_course_id_key";

ALTER TABLE "public"."go1_licenses" 
DROP CONSTRAINT IF EXISTS "go1_licenses_course_id_fkey";

ALTER TABLE "public"."go1_licenses" 
DROP COLUMN "course_id";

ALTER TABLE "public"."go1_licenses" 
ADD CONSTRAINT "go1_licenses_profile_id_org_id_key" 
UNIQUE ("profile_id", "org_id");
