alter table "public"."email_notifications" add column if not exists "status" text
 not null default 'SENT';
