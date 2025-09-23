alter table "public"."course_certificate_changelog" add column "notes" text;
alter table "public"."course_certificate_changelog" add column "new_grade" text;
alter table "public"."course_certificate_changelog" add column "old_grade" text;

alter table "public"."course_certificate_changelog"
  add constraint "course_certificate_changelog_new_grade_fkey"
  foreign key (new_grade)
  references "public"."grade"
  (name) on update cascade on delete cascade;

alter table "public"."course_certificate_changelog"
  add constraint "course_certificate_changelog_old_grade_fkey"
  foreign key (old_grade)
  references "public"."grade"
  (name) on update cascade on delete cascade;

alter table "public"."course_certificate_changelog" drop column "payload" cascade;
alter table "public"."course_certificate_changelog" drop column "type" cascade;
DROP TABLE "public"."course_certificate_changelog_type";
