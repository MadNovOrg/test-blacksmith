UPDATE "public"."course_participant"
SET completed = TRUE, completed_at = NOW()
FROM "public"."course"
WHERE "public"."course_participant".course_id = "public"."course".id
AND "public"."course".course_status = 'COMPLETED';
