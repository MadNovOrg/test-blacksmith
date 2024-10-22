CREATE FUNCTION get_organisation_by_email(email TEXT)
RETURNS SETOF organization
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM organization
  WHERE LOWER(attributes->>'email') = LOWER(email);
END;
$function$;
