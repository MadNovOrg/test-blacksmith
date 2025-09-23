CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS dfe_establishment_name_index ON public.dfe_establishment USING gin (name gin_trgm_ops);