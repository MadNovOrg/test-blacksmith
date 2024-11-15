DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'course_participant'
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE "public"."course_participant"
        ADD COLUMN "completed_at" TIMESTAMPTZ NULL;
    END IF;
END $$;
