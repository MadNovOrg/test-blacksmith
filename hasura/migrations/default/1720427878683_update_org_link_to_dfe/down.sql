UPDATE organization o
SET dfe_establishment_id = NULL
WHERE o.dfe_establishment_id IS NOT NULL
AND o.name IN (
    SELECT name
    FROM dfe_establishment
);
