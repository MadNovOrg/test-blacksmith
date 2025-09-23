CREATE TABLE "public"."course_certificate_changelog_type" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "course_certificate_changelog_type" ("name") VALUES
('GRADE_MODIFIED'),
('PUT_ON_HOLD'),
('UNREVOKED'),
('REVOKED');

alter table "public"."course_certificate_changelog" add column "type" text not null;
alter table "public"."course_certificate_changelog"
  add constraint "course_certificate_changelog_type_fkey"
  foreign key ("type")
  references "public"."course_certificate_changelog_type"
  ("name") on update cascade on delete restrict;

alter table "public"."course_certificate_changelog" add column "payload" jsonb
 null;
alter table "public"."course_certificate_changelog" drop column "old_grade" cascade;
alter table "public"."course_certificate_changelog" drop column "new_grade" cascade;
alter table "public"."course_certificate_changelog" drop column "notes" cascade;
