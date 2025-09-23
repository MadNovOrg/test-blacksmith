UPDATE organization o
SET dfe_establishment_id = NULL
WHERE o.name IN (
    SELECT name
    FROM dfe_establishment
);

ALTER TABLE "public"."organization"
    DROP COLUMN "dfe_establishment_id";