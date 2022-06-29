alter table "public"."organization_invites" add column "is_admin" boolean
 not null default 'false';
