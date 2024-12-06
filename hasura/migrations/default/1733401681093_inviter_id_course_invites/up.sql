
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'course_invites'
          AND column_name = 'inviter_id'
    ) THEN
        ALTER TABLE "public"."course_invites"
        ADD COLUMN "inviter_id" UUID NULL;
    END IF;
END
$$;

ALTER TABLE "public"."course_invites"
ADD CONSTRAINT "course_invites_inviter_id_fkey"
FOREIGN KEY ("inviter_id")
REFERENCES "public"."profile" ("id")
ON UPDATE CASCADE
ON DELETE SET NULL;

