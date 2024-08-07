ALTER TABLE public.dfe_establishment
ADD COLUMN search_post_code TEXT NULL;

CREATE OR REPLACE FUNCTION update_search_post_code_for_dfe_establishment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.postcode IS NOT NULL THEN
        NEW.search_post_code := LOWER(TRIM(REPLACE(NEW.postcode, ' ', '')));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_search_post_code_for_dfe_establishment
BEFORE INSERT OR UPDATE ON public.dfe_establishment
FOR EACH ROW
EXECUTE FUNCTION update_search_post_code_for_dfe_establishment();

UPDATE public.dfe_establishment
SET search_post_code = LOWER(TRIM(REPLACE(postcode, ' ', '')))
WHERE postcode IS NOT NULL;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS dfe_establishment_postcode_index ON public.dfe_establishment USING gin (name gin_trgm_ops);