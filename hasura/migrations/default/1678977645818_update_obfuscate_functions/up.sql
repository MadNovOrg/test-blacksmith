CREATE OR REPLACE FUNCTION public.profile_email(profile_row public.profile, hasura_session json) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT
    CASE
        WHEN profile_row.archived IS TRUE THEN '*****'
        ELSE profile_row._email
        END
$$;

CREATE OR REPLACE FUNCTION public.profile_phone(profile_row public.profile, hasura_session json) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT
    CASE
        WHEN profile_row.archived IS TRUE THEN '*****'
        ELSE profile_row._phone
        END
$$;
