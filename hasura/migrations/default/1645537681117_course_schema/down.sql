
alter table "public"."course" drop constraint "course_organization_id_fkey";

alter table "public"."course" drop column "organization_id";

alter table "public"."course" drop constraint "course_course_level_fkey",
  add constraint "course_level_fkey"
  foreign key ("course_level")
  references "public"."course_level"
  ("name") on update restrict on delete restrict;

alter table "public"."course" drop constraint "course_level_fkey";

alter table "public"."course" drop column "course_level";
alter table "public"."course" drop column "submitted";

DELETE FROM "public"."course_level" WHERE "name" = 'INTERMEDIATE';

DELETE FROM "public"."course_level" WHERE "name" = 'BILD_ACT';

DELETE FROM "public"."course_level" WHERE "name" = 'ADVANCED';

DELETE FROM "public"."course_level" WHERE "name" = 'LEVEL_2';

DELETE FROM "public"."course_level" WHERE "name" = 'LEVEL_1';

DROP TABLE "public"."course_level";

alter table "public"."course_leader" drop constraint "course_leader_profile_id_fkey";

alter table "public"."course_leader" drop constraint "course_leader_course_id_fkey";

DROP TABLE "public"."course_leader";
