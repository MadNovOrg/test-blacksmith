
alter table "public"."course_participant" add column "go1_enrolment_id" int4
 null;

alter table "public"."profile" add constraint "profile_email_key" unique ("email");
