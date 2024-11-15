DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'course_participant'
        AND column_name = 'completed'
    ) THEN
        ALTER TABLE "public"."course_participant"
        ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;
