ALTER TABLE "public"."organization"
ADD COLUMN "can_access_knowledge_hub" BOOLEAN DEFAULT TRUE;

ALTER TABLE "public"."profile"
ADD COLUMN "can_access_knowledge_hub" BOOLEAN DEFAULT TRUE;

CREATE OR REPLACE FUNCTION update_organization_member_knowledge_hub_access_on_org_access_update()
RETURNS TRIGGER AS $$
DECLARE
    member_row RECORD;
BEGIN
    FOR member_row IN
        SELECT p1.id AS id, p1.can_access_knowledge_hub AS can_access_knowledge_hub
        FROM public.organization_member om 
        INNER JOIN public.profile p1 ON om.profile_id = p1.id
        WHERE om.organization_id = NEW.id
    LOOP
        IF NEW.can_access_knowledge_hub = member_row.can_access_knowledge_hub THEN
            CONTINUE;
        ELSE
            IF NEW.can_access_knowledge_hub = false THEN
                UPDATE public.profile AS p2
                SET can_access_knowledge_hub = NEW.can_access_knowledge_hub
                WHERE p2.id = member_row.id 
                AND (
                    SELECT COUNT(*) 
                    FROM organization_member om
                    INNER JOIN organization o ON om.organization_id = o.id AND o.id <> NEW.id
                    WHERE om.profile_id = member_row.id AND o.can_access_knowledge_hub = true
                ) = 0;
            ELSE 
                UPDATE public.profile AS p3
                SET can_access_knowledge_hub = NEW.can_access_knowledge_hub
                WHERE p3.id = member_row.id;
            END IF;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_organization_member_knowledge_hub_access
AFTER INSERT OR UPDATE OF "can_access_knowledge_hub" ON "public"."organization"
FOR EACH ROW
EXECUTE FUNCTION update_organization_member_knowledge_hub_access_on_org_access_update();

CREATE OR REPLACE FUNCTION update_organization_member_knowledge_hub_access_on_org_member_removed()
RETURNS TRIGGER AS $$
DECLARE
    member_row RECORD;
BEGIN
    SELECT 
        p.id, 
        p.can_access_knowledge_hub AS profile_access, 
        (
            SELECT COUNT(*) 
            FROM organization_member om1
            INNER JOIN organization o1 ON om1.organization_id = o1.id AND o1.id <> OLD.organization_id
            WHERE om1.profile_id = p.id AND o1.can_access_knowledge_hub = true
        ) AS profile_org_access_number, 
        o.can_access_knowledge_hub AS org_access
    INTO member_row
    FROM public.profile p
    INNER JOIN public.organization o ON o.id = OLD.organization_id
    WHERE p.id = OLD.profile_id;

    if member_row.profile_access <> member_row.org_access then
        return OLD;
    else
        if member_row.profile_org_access_number = 0 then
            UPDATE public.profile AS p2
            SET can_access_knowledge_hub = false
            WHERE p2.id = OLD.profile_id;
        end if;
    end if;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_organization_member_knowledge_hub_access_after_member_removed
AFTER DELETE ON organization_member
FOR EACH ROW
EXECUTE FUNCTION update_organization_member_knowledge_hub_access_on_org_member_removed();

