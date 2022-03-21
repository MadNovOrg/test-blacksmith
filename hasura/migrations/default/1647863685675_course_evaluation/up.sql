
ALTER TABLE "course_evaluation_questions" DROP CONSTRAINT IF EXISTS "course_evaluation_questions_location_key";
UPDATE course_evaluation_questions SET location = 0;
ALTER TABLE "course_evaluation_questions" ALTER COLUMN location SET NOT NULL;
ALTER TABLE "course_evaluation_questions" ALTER COLUMN location SET DEFAULT 0;

alter table "public"."course_evaluation" add column "profile_id" uuid
 null;

alter table "public"."course_evaluation"
  add constraint "course_evaluation_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;

alter table "public"."course_evaluation" drop constraint "course_evaluation_course_id_key";

alter table "public"."course_evaluation" drop constraint "course_evaluation_participant_id_key";

DROP INDEX IF EXISTS "public"."course_evaluation_participant_id_key";

alter table "public"."course_evaluation" drop constraint "course_evaluation_participant_id_fkey";

alter table "public"."course_evaluation" drop column "participant_id" cascade;

alter table "public"."course_evaluation_questions" add column "type" text
 null;

CREATE TABLE "public"."course_evaluation_question_type" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."course_evaluation_question_type"("name") VALUES (E'RATING');

INSERT INTO "public"."course_evaluation_question_type"("name") VALUES (E'BOOLEAN');

INSERT INTO "public"."course_evaluation_question_type"("name") VALUES (E'TEXT');

alter table "public"."course_evaluation_questions"
  add constraint "course_evaluation_questions_type_fkey"
  foreign key ("type")
  references "public"."course_evaluation_question_type"
  ("name") on update cascade on delete restrict;

alter table "public"."course_evaluation_questions" alter column "type" set default 'TEXT';

UPDATE course_evaluation_questions SET "type" = 'TEXT';

alter table "public"."course_evaluation_questions" alter column "type" set not null;

alter table "public"."course_evaluation_questions" alter column "type" set default 'TEXT';

CREATE TABLE "public"."course_evaluation_question_group" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."course_evaluation_question_group"("name") VALUES (E'TRAINING_RATING');

INSERT INTO "public"."course_evaluation_question_group"("name") VALUES (E'TRAINING_RELEVANCE');

alter table "public"."course_evaluation_questions" add column "group" text
 null;

alter table "public"."course_evaluation_questions"
  add constraint "course_evaluation_questions_group_fkey"
  foreign key ("group")
  references "public"."course_evaluation_question_group"
  ("name") on update cascade on delete restrict;

alter table "public"."course_evaluation_questions" rename column "location" to "display_order";

alter table "public"."course_evaluation_answers" drop constraint "course_evaluation_answers_course_evaluation_id_fkey";

DROP table "public"."course_evaluation";

alter table "public"."course_evaluation_answers" add column "course_id" uuid
 null;

alter table "public"."course_evaluation_answers" add column "profile_id" uuid
 null;

alter table "public"."course_evaluation_answers" drop column "course_evaluation_id" cascade;

alter table "public"."course_evaluation_questions" add column "question_key" text
 null;

INSERT INTO "public"."course_evaluation_question_group"("name") VALUES (E'TRAINER_STANDARDS');

INSERT INTO "public"."course_evaluation_question_group"("name") VALUES (E'MATERIALS_AND_VENUE');

INSERT INTO "public"."course_evaluation_question_group"("name") VALUES (E'UNGROUPED');

INSERT INTO "public"."course_evaluation_question_type"("name") VALUES (E'BOOLEAN_REASON_Y');

INSERT INTO "public"."course_evaluation_question_type"("name") VALUES (E'BOOLEAN_REASON_N');

alter table "public"."course_evaluation_questions" alter column "type" drop not null;

alter table "public"."course_evaluation_questions" alter column "id" set default gen_random_uuid();

alter table "public"."course_evaluation_questions" add column "required" boolean
 null default 'TRUE';

alter table "public"."course_evaluation_questions" alter column "required" set not null;

alter table "public"."course_evaluation_answers"
  add constraint "course_evaluation_answers_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update restrict on delete restrict;

alter table "public"."course_evaluation_answers" alter column "profile_id" set not null;

alter table "public"."course_evaluation_answers"
  add constraint "course_evaluation_answers_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;

comment on table "public"."course_evaluation_answers" is NULL;
