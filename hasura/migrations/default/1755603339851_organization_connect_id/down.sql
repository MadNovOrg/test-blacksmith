DROP TRIGGER IF EXISTS trg_sync_org_tt_seq ON organization;

ALTER TABLE organization
ALTER COLUMN tt_connect_id DROP DEFAULT;

DROP SEQUENCE IF EXISTS organization_tt_id;

ALTER TABLE organization
DROP COLUMN IF EXISTS tt_connect_id;
