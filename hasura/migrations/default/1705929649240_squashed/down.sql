
ALTER TABLE "public"."course_invites" ALTER COLUMN "expires_in" TYPE timestamp without time zone;

alter table "public"."course_invites" drop column "expires_in";
