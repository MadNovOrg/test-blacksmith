
alter table "public"."course_participant" drop constraint "course_participant_go1_enrolment_status_fkey";

DELETE FROM "public"."blended_learning_status" WHERE "name" = 'COMPLETED';

DELETE FROM "public"."blended_learning_status" WHERE "name" = 'IN_PROGRESS';

DELETE FROM "public"."blended_learning_status" WHERE "name" = 'NOT_STARTED';

DELETE FROM "public"."blended_learning_status" WHERE "name" = 'ASSIGNED';

DROP TABLE "public"."blended_learning_status";

alter table "public"."course_participant" drop column "go1_enrolment_status";
