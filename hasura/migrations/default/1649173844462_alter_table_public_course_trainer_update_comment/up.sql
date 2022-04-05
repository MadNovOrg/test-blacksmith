-- Ensure there's only one LEADER per course (duplicates set to ASSISTANT)
UPDATE "public"."course_trainer"
SET "type" = 'ASSISTANT'
WHERE "id" IN (
	SELECT "id" FROM (
  	SELECT
  		ROW_NUMBER() OVER(PARTITION BY "course_id", "type") AS "row",
  		"course_id",
  		"profile_id",
  		"type",
  		"id"
  	FROM "public"."course_trainer"
	) "course_trainer_dups"
	WHERE "course_trainer_dups"."row" > 1 AND "type" = 'LEADER'
)

-- This index would fail without the mutation above
CREATE UNIQUE INDEX "course_trainer_unique_leader" ON "course_trainer" ("course_id") WHERE type = 'LEADER';
