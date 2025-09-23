alter table "public"."profile" add column "given_name" character varying;
alter table "public"."profile" add column "family_name" character varying;
alter table "public"."profile" add column "email" text;
alter table "public"."profile" add column "phone" text;

update "public"."profile" set "given_name" = "_given_name",
                              "family_name" = "_family_name",
                              "email" = "_email",
                              "phone" = "_phone";

drop function public.profile_given_name(profile_row public.profile);
drop function public.profile_family_name(profile_row public.profile);
drop function public.profile_email(profile_row public.profile, hasura_session json);
drop function public.profile_phone(profile_row public.profile, hasura_session json);

alter table "public"."profile" drop column "_given_name";
alter table "public"."profile" drop column "_family_name";
alter table "public"."profile" drop column "_email";
alter table "public"."profile" drop column "_phone";
alter table "public"."profile" drop column "archived";

