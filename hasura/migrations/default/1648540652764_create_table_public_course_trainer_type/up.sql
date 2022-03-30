CREATE TABLE "public"."course_trainer_type" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."course_trainer_type"("name") VALUES (E'LEADER'), (E'ASSISTANT'), (E'MODERATOR');

alter table "public"."course_leader"
    add constraint "course_leader_type_fkey"
        foreign key ("type")
            references "public"."course_trainer_type"
                ("name") on update restrict on delete restrict;