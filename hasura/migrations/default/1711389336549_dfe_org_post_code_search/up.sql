CREATE OR REPLACE FUNCTION public.dfe_org_post_code(dfe_establishment_row dfe_establishment)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT regexp_replace(lower(postcode), '\s+', '', 'g') AS postCode
FROM "public"."dfe_establishment"
WHERE id = dfe_establishment_row.id
$function$;
