alter table "public"."course_leader"
    drop constraint "course_leader_type_fkey";

DROP TABLE "public"."course_trainer_type";

UPDATE "public"."course_leader" SET type = LOWER(type);
