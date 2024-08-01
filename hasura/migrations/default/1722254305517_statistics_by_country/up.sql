
CREATE OR REPLACE VIEW users_by_country AS 
WITH country_mapping AS (
    SELECT
        CASE
            WHEN COALESCE("countryCode", '') = 'GB-ENG' THEN 'United Kingdom'
            WHEN COALESCE("countryCode", '') = 'GB-NIR' THEN 'United Kingdom'
            WHEN COALESCE("countryCode", '') = 'GB-SCT' THEN 'United Kingdom'
            WHEN COALESCE("countryCode", '') = 'GB-WLS' THEN 'United Kingdom'
            WHEN COALESCE("countryCode", '') = '' THEN 'United Kingdom'
            WHEN COALESCE("countryCode", '') = 'BO' THEN 'Bolivia'
            WHEN COALESCE("countryCode", '') = 'CD' THEN 'Democratic Republic of the Congo'
            WHEN COALESCE("countryCode", '') = 'CV' THEN 'Cape Verde'
            WHEN COALESCE("countryCode", '') = 'CZ' THEN 'Czech Republic'
            WHEN COALESCE("countryCode", '') = 'IR' THEN 'Iran'
            WHEN COALESCE("countryCode", '') = 'FM' THEN 'Micronesia'
            WHEN COALESCE("countryCode", '') = 'KP' THEN 'North Korea'
            WHEN COALESCE("countryCode", '') = 'KR' THEN 'South Korea'
            WHEN COALESCE("countryCode", '') = 'LA' THEN 'Laos'
            WHEN COALESCE("countryCode", '') = 'MD' THEN 'Moldova'
            WHEN COALESCE("countryCode", '') = 'MK' THEN 'North Macedonia'
            WHEN COALESCE("countryCode", '') = 'MM' THEN 'Myanmar'
            WHEN COALESCE("countryCode", '') = 'RU' THEN 'Russia'
            WHEN COALESCE("countryCode", '') = 'SY' THEN 'Syria'
            WHEN COALESCE("countryCode", '') = 'SZ' THEN 'Swaziland'
            WHEN COALESCE("countryCode", '') = 'TL' THEN 'East Timor'
            WHEN COALESCE("countryCode", '') = 'TW' THEN 'Taiwan'
            WHEN COALESCE("countryCode", '') = 'TZ' THEN 'Tanzania'
            WHEN COALESCE("countryCode", '') = 'VA' THEN 'Vatican City'
            WHEN COALESCE("countryCode", '') = 'VE' THEN 'Venezuela'
            WHEN COALESCE("countryCode", '') = 'VN' THEN 'Vietnam'
            ELSE COALESCE(country, '')
        END AS country,
        p."countryCode"
    FROM
        profile AS p
    WHERE 
        p.created_at > '2024-07-22' AND
        p.created_at < NOW()
)
SELECT
    country,
    COUNT(*) AS users_count
FROM
    country_mapping
GROUP BY
    country;

CREATE OR REPLACE VIEW trainers_by_country AS 
WITH country_mapping AS (
    SELECT
        CASE
            WHEN COALESCE(p."countryCode", '') = 'GB-ENG' THEN 'United Kingdom'
            WHEN COALESCE(p."countryCode", '') = 'GB-NIR' THEN 'United Kingdom'
            WHEN COALESCE(p."countryCode", '') = 'GB-SCT' THEN 'United Kingdom'
            WHEN COALESCE(p."countryCode", '') = 'GB-WLS' THEN 'United Kingdom'
            WHEN COALESCE(p."countryCode", '') = '' THEN 'United Kingdom'
            WHEN COALESCE(p."countryCode", '') = 'BO' THEN 'Bolivia'
            WHEN COALESCE(p."countryCode", '') = 'CD' THEN 'Democratic Republic of the Congo'
            WHEN COALESCE(p."countryCode", '') = 'CV' THEN 'Cape Verde'
            WHEN COALESCE(p."countryCode", '') = 'CZ' THEN 'Czech Republic'
            WHEN COALESCE(p."countryCode", '') = 'IR' THEN 'Iran'
            WHEN COALESCE(p."countryCode", '') = 'FM' THEN 'Micronesia'
            WHEN COALESCE(p."countryCode", '') = 'KP' THEN 'North Korea'
            WHEN COALESCE(p."countryCode", '') = 'KR' THEN 'South Korea'
            WHEN COALESCE(p."countryCode", '') = 'LA' THEN 'Laos'
            WHEN COALESCE(p."countryCode", '') = 'MD' THEN 'Moldova'
            WHEN COALESCE(p."countryCode", '') = 'MK' THEN 'North Macedonia'
            WHEN COALESCE(p."countryCode", '') = 'MM' THEN 'Myanmar'
            WHEN COALESCE(p."countryCode", '') = 'RU' THEN 'Russia'
            WHEN COALESCE(p."countryCode", '') = 'SY' THEN 'Syria'
            WHEN COALESCE(p."countryCode", '') = 'SZ' THEN 'Swaziland'
            WHEN COALESCE(p."countryCode", '') = 'TL' THEN 'East Timor'
            WHEN COALESCE(p."countryCode", '') = 'TW' THEN 'Taiwan'
            WHEN COALESCE(p."countryCode", '') = 'TZ' THEN 'Tanzania'
            WHEN COALESCE(p."countryCode", '') = 'VA' THEN 'Vatican City'
            WHEN COALESCE(p."countryCode", '') = 'VE' THEN 'Venezuela'
            WHEN COALESCE(p."countryCode", '') = 'VN' THEN 'Vietnam'
            ELSE COALESCE(p.country, '')
        END AS country,
        p.id
    FROM 
        profile_role AS pr
        LEFT JOIN profile AS p ON pr.profile_id = p.id
    WHERE 
        pr.role_id = (SELECT id FROM role WHERE name = 'trainer') AND
        p.created_at > '2024-07-22' AND
        p.created_at < NOW()
)
SELECT
    country,
    COUNT(DISTINCT id) AS trainers_count
FROM
    country_mapping
GROUP BY
    country;
    

CREATE OR REPLACE VIEW orders_by_country AS 
WITH country_mapping AS (
    SELECT
        CASE
            WHEN COALESCE(org.address->>'country', '') = '' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'UK' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'United Kingdom' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'England' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'Scotland' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'Northern Ireland' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'Wales' THEN 'United Kingdom'
            WHEN COALESCE(org.address->>'country', '') = 'Taiwan, Province of China' THEN 'Taiwan'
            ELSE COALESCE(org.address->>'country', '')
        END AS country,
        o.id AS order_id
    FROM 
        organization AS org
        LEFT JOIN "order" AS o ON o.organization_id = org.id
    WHERE 
        o.created_at > '2024-07-22' AND
        o.created_at < NOW()
)
SELECT
    country,
    COUNT(*) AS orders_count
FROM
    country_mapping
GROUP BY
    country;

CREATE OR REPLACE VIEW hubspot_international_dashboard_report AS
SELECT 
    COALESCE(ubc.country, obc.country) as country,
    COALESCE(ubc.users_count, 0) AS users_count,
    COALESCE(tbc.trainers_count, 0) AS trainers_count,
    COALESCE(obc.orders_count,0) AS orders_count
FROM
    users_by_country AS ubc
    FULL JOIN trainers_by_country AS tbc ON ubc.country = tbc.country
    FULL JOIN orders_by_country as obc ON ubc.country = obc.country
ORDER BY
    country;