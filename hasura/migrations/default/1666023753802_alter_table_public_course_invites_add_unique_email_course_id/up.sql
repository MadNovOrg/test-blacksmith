alter table "public"."course_invites" add constraint "course_invites_email_course_id_key" unique ("email", "course_id");
