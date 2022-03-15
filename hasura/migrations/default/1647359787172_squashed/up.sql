
CREATE TABLE "public"."course_evaluation_questions" ("id" uuid NOT NULL, "question" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("question"));COMMENT ON TABLE "public"."course_evaluation_questions" IS E'Table for storing text and references of course evaluation questions';

INSERT INTO course_evaluation_questions (id, question) VALUES
('37912a65-0aa1-4eeb-a811-bcdfa020e654', 'Objectives clearly stated'),
('b42e8a1a-f986-4d57-ba78-a103a691a0df', 'Objectives achieved'),
('1fb89703-3ad6-4ac4-8fa1-d5a20c6666d4', 'Emphasis on de-escalation/holistic response'),
('bb19e071-0c16-425b-8904-a7d1776d0255', 'Risk reduction/safety as paramount concern'),
('4f1ad3c4-dc1e-4377-9ca6-9b77e2e5ea71', 'Value of training'),
('c8f9da1f-c1c9-4bf9-bf43-35215b207414', 'Pertinence to work role'),
('9822d7e6-e658-435d-b9a4-b7c0f1373056', 'Attitude and approach of trainers'),
('7195b2ba-013f-4017-9c80-5e9d8fddd198', 'Knowledge of subject'),
('cb7e872d-dedc-4572-83fd-49b59d95756e', 'Preparation and organisation'),
('de9db923-f5f6-4639-aefa-58cea9653a65', 'Group participation'),
('52bb8ec3-ea89-4172-9907-04d8832f7458', 'Workbook and presentation materials'),
('4f0546bb-235f-4726-95b4-5a1a486a9a8f', 'Suitability of training environment'),
('bf6160fd-dda1-48fc-b468-af531fd8094c', 'Lunch & refreshments'),
('e07c67e5-38bf-485f-abd7-59df3a475eae', 'Were there any issues arising from the course?'),
('6b38f7f7-36b3-47a7-aa7d-30395426ff8f', 'What would you describe as the key strengths of this course?'),
('7786bcb2-ed01-4d5c-930f-501ae62eaa91', 'What follow up or changes can you suggest to further develop our practice?');

CREATE TABLE "public"."course_evaluation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "participant_id" uuid NOT NULL, "course_id" uuid NOT NULL, "signed" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("participant_id") REFERENCES "public"."course_participant"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("participant_id"), UNIQUE ("course_id"));COMMENT ON TABLE "public"."course_evaluation" IS E'Table that stores reference to course and participant, as well as whether the participant signed off on their evaluation';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."course_evaluation_answers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "question_id" uuid NOT NULL, "answer" text, "course_evaluation_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("question_id") REFERENCES "public"."course_evaluation_questions"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("course_evaluation_id") REFERENCES "public"."course_evaluation"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("question_id", "course_evaluation_id"));COMMENT ON TABLE "public"."course_evaluation_answers" IS E'Answers to course evaluation questions, as well as pointer to course evaluation questionnaire instance';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
