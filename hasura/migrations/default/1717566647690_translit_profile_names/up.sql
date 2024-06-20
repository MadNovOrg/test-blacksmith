
ALTER TABLE "public"."profile"
ADD COLUMN "translated_given_name" TEXT NULL;

ALTER TABLE "public"."profile"
ADD COLUMN "translated_family_name" TEXT NULL;

CREATE OR REPLACE FUNCTION public.profile_translated_family_name(profile_row profile)
RETURNS text
LANGUAGE sql
STABLE
AS $function$
SELECT
    CASE
        WHEN profile_row.archived IS TRUE THEN '*****'
        ELSE profile_row.translated_family_name
    END
$function$;

CREATE OR REPLACE FUNCTION public.profile_translated_given_name(profile_row profile)
RETURNS text
LANGUAGE sql
STABLE
AS $function$
SELECT
    CASE
        WHEN profile_row.archived IS TRUE THEN '*****'
        ELSE profile_row.translated_given_name
    END
$function$;
