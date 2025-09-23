DROP TRIGGER sync_organization_member_knowledge_hub_access ON "public"."organization";
DROP TRIGGER sync_organization_member_knowledge_hub_access_after_member_removed ON "public"."organization_member";

DROP FUNCTION update_organization_member_knowledge_hub_access_on_org_access_update();
DROP FUNCTION update_organization_member_knowledge_hub_access_on_org_member_removed();

ALTER TABLE public.organization
DROP COLUMN can_access_knowledge_hub;

ALTER TABLE public.profile
DROP COLUMN can_access_knowledge_hub;