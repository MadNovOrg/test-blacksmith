ALTER TABLE "public"."dfe_establishment"
ADD COLUMN "registered" BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE FUNCTION update_dfe_establishment_registered()
RETURNS TRIGGER AS $$
BEGIN
    DECLARE
        target_id UUID;
    BEGIN
        IF (TG_OP = 'DELETE' || NEW.dfe_establishment_id IS NULL) THEN
            target_id := OLD.dfe_establishment_id;
        ELSE
            target_id := NEW.dfe_establishment_id;
        END IF;

        -- Check if there are any organizations referencing the dfe_establishment
        IF EXISTS (
            SELECT 1
            FROM organization
            WHERE dfe_establishment_id = target_id
        ) THEN
            UPDATE dfe_establishment
            SET registered = TRUE
            WHERE id = target_id;
        ELSE
            UPDATE dfe_establishment
            SET registered = FALSE
            WHERE id = target_id;
        END IF;
        
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organization_dfe_establishment_insert
AFTER INSERT ON organization
FOR EACH ROW
EXECUTE FUNCTION update_dfe_establishment_registered();

CREATE TRIGGER organization_dfe_establishment_update
AFTER UPDATE OF dfe_establishment_id ON organization
FOR EACH ROW
EXECUTE FUNCTION update_dfe_establishment_registered();

CREATE TRIGGER organization_dfe_establishment_delete
AFTER DELETE ON organization
FOR EACH ROW
EXECUTE FUNCTION update_dfe_establishment_registered();

UPDATE dfe_establishment de
SET registered = TRUE
WHERE EXISTS (
    SELECT 1
    FROM organization o
    WHERE o.dfe_establishment_id = de.id
    GROUP BY o.dfe_establishment_id
    HAVING COUNT(*) > 0
);
