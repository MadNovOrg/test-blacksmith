alter table "public"."course_trainer"
  add constraint "course_trainer_status_fkey"
  foreign key ("status")
  references "public"."course_invite_status"
  ("name") on update restrict on delete restrict;
