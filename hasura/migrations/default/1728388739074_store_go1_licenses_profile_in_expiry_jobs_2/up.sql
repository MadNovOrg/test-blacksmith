ALTER TABLE "public"."expire_go1_license_jobs" 
ADD COLUMN "profile_id" UUID NULL;

ALTER TABLE "public"."expire_go1_license_jobs"
ADD CONSTRAINT "expire_go1_license_jobs_profile_id_fkey"
FOREIGN KEY ("profile_id")
REFERENCES "public"."profile" ("id")
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE "public"."expire_go1_license_jobs" 
DROP CONSTRAINT "expire_go1_license_jobs_job_id_license_id_key";

ALTER TABLE "public"."expire_go1_license_jobs" 
ADD CONSTRAINT "expire_go1_license_jobs_job_id_license_id_profile_id_key"
UNIQUE ("job_id", "license_id", "profile_id");
