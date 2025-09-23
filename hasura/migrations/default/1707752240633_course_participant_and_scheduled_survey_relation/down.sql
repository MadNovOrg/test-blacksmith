
alter table "public"."about_training_email_scheduled_events" drop constraint "about_training_email_scheduled_events_course_participant_id_key";

alter table "public"."about_training_email_scheduled_events" add constraint "about_training_email_scheduled_events_course_participant_id_event_id_key" unique ("course_participant_id", "event_id");

alter table "public"."about_training_email_scheduled_events" drop constraint "about_training_email_scheduled_events_course_participant_id_";
