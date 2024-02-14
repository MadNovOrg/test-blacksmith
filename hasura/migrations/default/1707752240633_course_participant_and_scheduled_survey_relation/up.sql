delete
from "public"."about_training_email_scheduled_events" as about_training_email_scheduled_events
where
    (select count(*)
     from "public"."course_participant" as course_participant
     where course_participant.id = about_training_email_scheduled_events.course_participant_id) = 0;

alter table "public"."about_training_email_scheduled_events"
  add constraint "about_training_email_scheduled_events_course_participant_id_"
  foreign key ("course_participant_id")
  references "public"."course_participant"
  ("id") on update cascade on delete cascade;

alter table "public"."about_training_email_scheduled_events" drop constraint "about_training_email_schedule_course_participant_id_event_i_key";

alter table "public"."about_training_email_scheduled_events" add constraint "about_training_email_scheduled_events_course_participant_id_key" unique ("course_participant_id");
