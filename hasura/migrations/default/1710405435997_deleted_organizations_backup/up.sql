CREATE TABLE IF NOT EXISTS public.deleted_organizations_backup (
    id UUID,
    name CHARACTER VARYING,
    tags JSONB,
    contact_details JSONB,
    attributes JSONB,
    address JSONB,
    preferences JSONB,
    original_record JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    xero_contact_id TEXT,
    sector TEXT,
    region TEXT,
    go1_licenses INTEGER,
    geo_coordinates POINT,
    reserved_go1_licenses INTEGER,
    organisation_type TEXT
);
