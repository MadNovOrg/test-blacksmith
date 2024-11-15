UPDATE "public"."expire_go1_license_jobs" j
SET profile_id = l.profile_id
FROM "public"."go1_licenses" l
WHERE l.id = j.license_id;
