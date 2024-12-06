ALTER TABLE "public"."course_invites" 
DROP CONSTRAINT IF EXISTS "course_invites_inviter_id_fkey";

ALTER TABLE "public"."course_invites" 
DROP COLUMN IF EXISTS "inviter_id";
