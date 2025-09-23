alter table "public"."course_draft" add constraint "course_draft_profile_id_course_type_key" unique ("profile_id", "course_type");
