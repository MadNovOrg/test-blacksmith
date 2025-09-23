DROP INDEX IF EXISTS "public"."merge_organizations_logs_primary_organization_idx";

DROP INDEX IF EXISTS "public"."merged_organizations_organization_name";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trigger_update_merge_logs_on_org_name_change'
  ) THEN
    DROP TRIGGER trigger_update_merge_logs_on_org_name_change ON organization;
  END IF;
END
$$;

DROP TABLE IF EXISTS "public"."merged_organizations";

DROP TABLE "public"."merge_organizations_logs";