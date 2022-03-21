alter table "public"."course_evaluation_questions" drop constraint "course_evaluation_questions_question_key_key";
alter table "public"."course_evaluation_questions" add constraint "course_evaluation_questions_question_key" unique ("question");
