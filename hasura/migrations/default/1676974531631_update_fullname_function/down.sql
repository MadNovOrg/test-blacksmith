DROP FUNCTION public.profile_full_name(profile_row public.profile);

CREATE FUNCTION public.profile_full_name(profile_row public.profile) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT profile_row._given_name || ' ' || profile_row._family_name
$$;
