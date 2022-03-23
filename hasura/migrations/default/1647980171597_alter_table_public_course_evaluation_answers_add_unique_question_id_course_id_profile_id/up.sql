alter table "public"."course_evaluation_answers" add constraint "course_evaluation_answers_question_id_course_id_profile_id_key" unique ("question_id", "course_id", "profile_id");
