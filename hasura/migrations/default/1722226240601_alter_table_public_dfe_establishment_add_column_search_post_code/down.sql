DROP INDEX IF EXISTS dfe_establishment_postcode_index;

DROP TRIGGER IF EXISTS trg_update_search_post_code_for_dfe_establishment
ON public.dfe_establishment;

DROP FUNCTION IF EXISTS update_search_post_code_for_dfe_establishment();

ALTER TABLE public.dfe_establishment
DROP COLUMN search_post_code;

