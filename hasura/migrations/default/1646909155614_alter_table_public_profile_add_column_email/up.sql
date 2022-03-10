alter table "public"."profile" add column "email" text null;

with subquery as (
    select p.id as profile_id, details.value as email
    from profile p, jsonb_to_recordset(p.contact_details) as details(type text, value text)
    where type = 'email'
)
update "public"."profile" set email = subquery.email
from subquery
where subquery.profile_id = id;
