
comment on table "public"."course_evaluation_answers" is NULL;

alter table "public"."course_evaluation_answers" drop constraint "course_evaluation_answers_profile_id_fkey";

alter table "public"."course_evaluation_answers" alter column "profile_id" drop not null;

alter table "public"."course_evaluation_answers" drop constraint "course_evaluation_answers_course_id_fkey";

alter table "public"."course_evaluation_questions" alter column "required" drop not null;

alter table "public"."course_evaluation_questions" drop column "required";

ALTER TABLE "public"."course_evaluation_questions" ALTER COLUMN "id" drop default;

alter table "public"."course_evaluation_questions" alter column "type" set not null;

DELETE FROM "public"."course_evaluation_question_type" WHERE "name" = 'BOOLEAN_REASON_N';

DELETE FROM "public"."course_evaluation_question_type" WHERE "name" = 'BOOLEAN_REASON_Y';

DELETE FROM "public"."course_evaluation_question_group" WHERE "name" = 'UNGROUPED';

DELETE FROM "public"."course_evaluation_question_group" WHERE "name" = 'MATERIALS_AND_VENUE';

DELETE FROM "public"."course_evaluation_question_group" WHERE "name" = 'TRAINER_STANDARDS';

alter table "public"."course_evaluation_questions" DROP column "question_key";

comment on column "public"."course_evaluation_answers"."course_evaluation_id" is E'Answers to course evaluation questions, as well as pointer to course evaluation questionnaire instance';
alter table "public"."course_evaluation_answers" add constraint "course_evaluation_answers_question_id_course_evaluation_id_key" unique (course_evaluation_id, question_id);
alter table "public"."course_evaluation_answers" alter column "course_evaluation_id" drop not null;
alter table "public"."course_evaluation_answers" add column "course_evaluation_id" uuid;

alter table "public"."course_evaluation_answers" DROP column "profile_id";

alter table "public"."course_evaluation_answers" DROP column "course_id";

-- From 1647359787172_squashed
CREATE TABLE "public"."course_evaluation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "participant_id" uuid NOT NULL, "course_id" uuid NOT NULL, "signed" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("participant_id") REFERENCES "public"."course_participant"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("participant_id"), UNIQUE ("course_id"));COMMENT ON TABLE "public"."course_evaluation" IS E'Table that stores reference to course and participant, as well as whether the participant signed off on their evaluation';

alter table "public"."course_evaluation_answers"
  add constraint "course_evaluation_answers_course_evaluation_id_fkey"
  foreign key ("course_evaluation_id")
  references "public"."course_evaluation"
  ("id") on update restrict on delete restrict;

alter table "public"."course_evaluation_questions" rename column "display_order" to "location";

alter table "public"."course_evaluation_questions" drop constraint "course_evaluation_questions_group_fkey";

alter table "public"."course_evaluation_questions" drop column "group";

DELETE FROM "public"."course_evaluation_question_group" WHERE "name" = 'TRAINING_RELEVANCE';

DELETE FROM "public"."course_evaluation_question_group" WHERE "name" = 'TRAINING_RATING';

DROP TABLE "public"."course_evaluation_question_group";

alter table "public"."course_evaluation_questions" alter column "type" set default 'TEXT'::text;

alter table "public"."course_evaluation_questions" alter column "type" drop not null;

ALTER TABLE "public"."course_evaluation_questions" ALTER COLUMN "type" drop default;

alter table "public"."course_evaluation_questions" drop constraint "course_evaluation_questions_type_fkey";

DELETE FROM "public"."course_evaluation_question_type" WHERE "name" = 'TEXT';

DELETE FROM "public"."course_evaluation_question_type" WHERE "name" = 'BOOLEAN';

DELETE FROM "public"."course_evaluation_question_type" WHERE "name" = 'RATING';

DROP TABLE "public"."course_evaluation_question_type";

alter table "public"."course_evaluation_questions" drop column "type";

comment on column "public"."course_evaluation"."participant_id" is E'Table that stores reference to course and participant, as well as whether the participant signed off on their evaluation';
alter table "public"."course_evaluation" alter column "participant_id" drop not null;
alter table "public"."course_evaluation" add column "participant_id" uuid;

alter table "public"."course_evaluation"
  add constraint "course_evaluation_participant_id_fkey"
  foreign key ("participant_id")
  references "public"."course_participant"
  ("id") on update restrict on delete restrict;

CREATE  INDEX "course_evaluation_participant_id_key" on
  "public"."course_evaluation" using btree ("participant_id");

alter table "public"."course_evaluation" add constraint "course_evaluation_participant_id_key" unique ("participant_id");

alter table "public"."course_evaluation" add constraint "course_evaluation_course_id_key" unique ("course_id");

alter table "public"."course_evaluation" drop constraint "course_evaluation_profile_id_fkey";

alter table "public"."course_evaluation" drop column "profile_id";

ALTER TABLE "course_evaluation_questions" ALTER COLUMN location DROP NOT NULL;
ALTER TABLE "course_evaluation_questions" ALTER COLUMN location DROP DEFAULT;
UPDATE course_evaluation_questions SET location = NULL;
alter table "public"."course_evaluation_questions" add constraint "course_evaluation_questions_location_key" unique ("location");
