
alter table "public"."course_participant" add column "grading_feedback" text
 null;

alter table "public"."course_participant" add column "grade" text
 null;

alter table "public"."course_participant"
  add constraint "course_participant_grade_fkey"
  foreign key ("grade")
  references "public"."grade"
  ("name") on update restrict on delete restrict;

alter table "public"."course_participant" drop column "graded" cascade;

DROP table "public"."course_participant_grading";

CREATE TABLE "public"."course_participant_module" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_participant_id" uuid NOT NULL, "module_id" uuid NOT NULL, "completed" boolean NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("course_participant_id") REFERENCES "public"."course_participant"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("course_participant_id", "module_id"));COMMENT ON TABLE "public"."course_participant_module" IS E'Course modules that course participant completed';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
