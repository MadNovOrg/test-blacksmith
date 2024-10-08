
ALTER TABLE "public"."course_participant" 
ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "public"."course_participant"
ADD COLUMN "completed_at" TIMESTAMPTZ NULL;
