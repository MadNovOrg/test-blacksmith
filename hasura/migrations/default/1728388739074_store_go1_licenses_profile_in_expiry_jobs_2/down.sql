ALTER TABLE "public"."expire_go1_license_jobs" 
DROP CONSTRAINT "expire_go1_license_jobs_job_id_license_id_profile_id_key";

ALTER TABLE "public"."expire_go1_license_jobs" 
ADD CONSTRAINT "expire_go1_license_jobs_job_id_license_id_key" 
UNIQUE ("job_id", "license_id");

ALTER TABLE "public"."expire_go1_license_jobs" 
DROP CONSTRAINT "expire_go1_license_jobs_profile_id_fkey";

ALTER TABLE "public"."expire_go1_license_jobs" 
DROP COLUMN "profile_id";
