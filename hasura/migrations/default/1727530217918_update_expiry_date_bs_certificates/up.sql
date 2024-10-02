UPDATE "public"."course_certificate"
SET "expiry_date" = "expiry_date" + INTERVAL '1 year'
WHERE course_level = 'LEVEL_1_BS';
