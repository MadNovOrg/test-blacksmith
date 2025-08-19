DROP INDEX IF EXISTS "public"."submission_of_splash_screens_profile_id_idx";

-- Drop foreign key constraint
ALTER TABLE "public"."submission_of_splash_screens"
DROP CONSTRAINT "submission_of_splash_screens_splash_screen_fkey";

DROP TABLE IF EXISTS public.submission_of_splash_screens CASCADE;

-- Delete specific splash screen entry
DELETE FROM "public"."splash_screens"
WHERE "name" = 'ORGANISATIONS_INSIGHT_REPORTS';

-- Drop the splash_screens table
DROP TABLE "public"."splash_screens";
