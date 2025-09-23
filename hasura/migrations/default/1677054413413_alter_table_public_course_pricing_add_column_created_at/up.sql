alter table "public"."course_pricing" add column "created_at" timestamptz
 null default now();
