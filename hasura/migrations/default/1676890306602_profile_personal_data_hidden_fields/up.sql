alter table "public"."profile" add column "_given_name" text null;
alter table "public"."profile" add column "_family_name" text null;
alter table "public"."profile" add column "_email" text null;
alter table "public"."profile" add column "_phone" text null;
alter table "public"."profile" add column "archived" boolean DEFAULT false;

update "public"."profile" set "_given_name" = "given_name",
                              "_family_name" = "family_name",
                              "_email" = "email",
                              "_phone" = "phone";

alter table "public"."profile" drop column "given_name";
alter table "public"."profile" drop column "family_name";
alter table "public"."profile" drop column "email";
alter table "public"."profile" drop column "phone";

CREATE FUNCTION public.profile_given_name(profile_row public.profile) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT
    CASE WHEN profile_row.archived IS TRUE then '*****'
         ELSE profile_row._given_name
        END
$$;

CREATE FUNCTION public.profile_family_name(profile_row public.profile) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT
    CASE WHEN profile_row.archived IS TRUE then '*****'
         ELSE profile_row._family_name
        END
$$;

CREATE FUNCTION public.profile_email(profile_row public.profile, hasura_session json) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT
    CASE
        WHEN hasura_session->>'x-hasura-role' = 'trainer' THEN '*****'
        WHEN profile_row.archived IS TRUE THEN '*****'
        ELSE profile_row._email
    END
$$;

CREATE FUNCTION public.profile_phone(profile_row public.profile, hasura_session json) RETURNS text
    LANGUAGE sql STABLE
AS $$
SELECT
    CASE
        WHEN hasura_session->>'x-hasura-role' = 'trainer' THEN '*****'
        WHEN profile_row.archived IS TRUE THEN '*****'
        ELSE profile_row._phone
    END
$$;
