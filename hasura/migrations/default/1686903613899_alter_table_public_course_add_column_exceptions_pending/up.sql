alter table "public"."course" add column "exceptions_pending" boolean
 not null default 'false';
