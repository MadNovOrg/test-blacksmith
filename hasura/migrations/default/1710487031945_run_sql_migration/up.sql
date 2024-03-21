CREATE OR REPLACE FUNCTION public.org_address_post_code(org_row organization)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT regexp_replace(lower(address->>'postCode'), '\s+', '', 'g') AS postCode
FROM "public"."organization"
WHERE id = org_row.id
$function$;
