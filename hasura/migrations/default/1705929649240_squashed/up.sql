
alter table "public"."course_invites" add column "expires_in" Timestamp
 null;

ALTER TABLE "public"."course_invites" ALTER COLUMN "expires_in" TYPE timestamptz;
