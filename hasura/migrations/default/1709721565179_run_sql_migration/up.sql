CREATE OR REPLACE FUNCTION public.org_address_each_text(org_row "public"."organization")
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
SELECT string_agg(value, '') AS concatenated_values
FROM (
  SELECT value
  FROM "public"."organization",
       jsonb_each_text(address)
  WHERE id = org_row.id
) AS all_values
$function$;
