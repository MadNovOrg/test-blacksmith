alter table "public"."course_participant" add constraint "course_participant_profile_id_course_id_key" unique ("profile_id", "course_id");
