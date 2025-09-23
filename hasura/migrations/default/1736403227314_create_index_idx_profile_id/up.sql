CREATE INDEX IF NOT EXISTS "idx_profile_id" 
ON "public"."course_evaluation_answers" 
USING hash ("profile_id");
