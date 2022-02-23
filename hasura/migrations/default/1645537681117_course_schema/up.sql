
CREATE TABLE "public"."course_leader" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "profile_id" uuid NOT NULL, "course_id" uuid NOT NULL, "type" text NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."course_leader"
  add constraint "course_leader_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update restrict on delete restrict;

alter table "public"."course_leader"
  add constraint "course_leader_profile_id_fkey"
  foreign key ("profile_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;

alter table "public"."course" add column "submitted" boolean
 null default 'false';

CREATE TABLE "public"."course_level" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."course_level"("name") VALUES (E'LEVEL_1');

INSERT INTO "public"."course_level"("name") VALUES (E'LEVEL_2');

INSERT INTO "public"."course_level"("name") VALUES (E'ADVANCED');

INSERT INTO "public"."course_level"("name") VALUES (E'BILD_ACT');

INSERT INTO "public"."course_level"("name") VALUES (E'INTERMEDIATE');

alter table "public"."course" add column "course_level" text null;

alter table "public"."course"
  add constraint "course_level_fkey"
  foreign key ("course_level")
  references "public"."course_level"
  ("name") on update restrict on delete restrict;

alter table "public"."course" drop constraint "course_level_fkey",
  add constraint "course_course_level_fkey"
  foreign key ("course_level")
  references "public"."course_level"
  ("name") on update cascade on delete restrict;

alter table "public"."course" add column "organization_id" uuid null;

alter table "public"."course"
  add constraint "course_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization"
  ("id") on update restrict on delete restrict;
