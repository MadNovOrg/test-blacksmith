UPDATE "public"."venue"
SET country = COALESCE(country, 'England')
WHERE country is NULL;
