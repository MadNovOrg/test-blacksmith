
CREATE TABLE "public"."course_status" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."course_status"("name") VALUES (E'PENDING');

INSERT INTO "public"."course_status"("name") VALUES (E'DRAFT');

INSERT INTO "public"."course_status"("name") VALUES (E'PUBLISHED');

alter table "public"."course" drop column "submitted" cascade;

alter table "public"."course" add column "course_status" text
 null;

alter table "public"."course"
  add constraint "course_course_status_fkey"
  foreign key ("course_status")
  references "public"."course_status"
  ("name") on update cascade on delete restrict;
