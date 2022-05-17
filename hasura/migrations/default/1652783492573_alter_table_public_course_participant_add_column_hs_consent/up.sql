alter table "public"."course_participant" add column "hs_consent" boolean
 not null default 'false';
