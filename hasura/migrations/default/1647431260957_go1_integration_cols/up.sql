
alter table "public"."course_participant" add column "go1_enrolment_status" text null;

CREATE TABLE "public"."blended_learning_status" ("name" text NOT NULL, PRIMARY KEY ("name") );COMMENT ON TABLE "public"."blended_learning_status" IS E'status enum for go1 course/module';

INSERT INTO "public"."blended_learning_status"("name") VALUES (E'ASSIGNED');

INSERT INTO "public"."blended_learning_status"("name") VALUES (E'NOT_STARTED');

INSERT INTO "public"."blended_learning_status"("name") VALUES (E'IN_PROGRESS');

INSERT INTO "public"."blended_learning_status"("name") VALUES (E'COMPLETED');

alter table "public"."course_participant"
  add constraint "course_participant_go1_enrolment_status_fkey"
  foreign key ("go1_enrolment_status")
  references "public"."blended_learning_status"
  ("name") on update cascade on delete restrict;
