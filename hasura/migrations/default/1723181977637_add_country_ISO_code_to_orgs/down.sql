UPDATE organization
SET address = jsonb_set(
    address,
    '{countryCode}',
    'null'::jsonb,
    true
)
WHERE NOT address ? 'countryCode';

DROP TABLE IF EXISTS country_codes;
