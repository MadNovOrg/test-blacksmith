


CREATE  INDEX "course_participant_course_id" on
  "public"."course_participant" using btree ("course_id");

CREATE  INDEX "course_trainer_course_id" on
  "public"."course_trainer" using btree ("course_id");

CREATE  INDEX "course_module_course_id" on
  "public"."course_module" using btree ("course_id");

CREATE  INDEX "course_organization_id" on
  "public"."course" using btree ("organization_id");

CREATE  INDEX "course_trainer_profile_id" on
  "public"."course_trainer" using btree ("profile_id");

CREATE  INDEX "waitlist_course_id" on
  "public"."waitlist" using btree ("course_id");

CREATE  INDEX "course_schedule_course_id" on
  "public"."course_schedule" using btree ("course_id");

CREATE  INDEX "course_cancellation_request_course_id" on
  "public"."course_cancellation_request" using btree ("course_id");

CREATE  INDEX "course_schedule_venue_id" on
  "public"."course_schedule" using btree ("venue_id");

CREATE  INDEX "course_schedule_start" on
  "public"."course_schedule" using btree ("start");

CREATE  INDEX "course_schedule_end" on
  "public"."course_schedule" using btree ("end");

CREATE  INDEX "course_invites_course_id" on
  "public"."course_invites" using btree ("course_id");

CREATE  INDEX "course_participant_invite_id" on
  "public"."course_participant" using btree ("invite_id");
