CREATE INDEX org_residing_country_code_idx ON organization((address->>'countryCode'));

CREATE VIEW org_distinct_country_codes AS
SELECT DISTINCT address->>'countryCode' AS countryCode
    FROM organization
    WHERE address ? 'countryCode';



