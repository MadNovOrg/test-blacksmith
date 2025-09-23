
DROP FUNCTION IF EXISTS public.profile_translated_given_name(profile);

DROP FUNCTION IF EXISTS public.profile_translated_family_name(profile);

ALTER TABLE "public"."profile"
DROP COLUMN "translated_given_name";

ALTER TABLE "public"."profile"
DROP COLUMN "translated_family_name";
