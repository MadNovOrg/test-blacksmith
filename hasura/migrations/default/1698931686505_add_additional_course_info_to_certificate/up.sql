
alter table "public"."course_certificate" add column "course_accredited_by" text not null;

alter table "public"."course_certificate" add column "blended_learning" boolean not null;

alter table "public"."course_certificate" add column "reaccreditation" boolean not null;

alter table "public"."course_certificate"
  add constraint "course_certificate_course_accredited_by_fkey"
  foreign key ("course_accredited_by")
  references "public"."accreditors"
  ("name") on update cascade on delete no action;

-- populate fields for existing certificates
UPDATE course_certificate
SET blended_learning = (select go1_integration from course where course.id = course_certificate.course_id);

UPDATE course_certificate
SET reaccreditation = (select reaccreditation from course where course.id = course_certificate.course_id);

UPDATE course_certificate
SET course_accredited_by = (select accredited_by from course where course.id = course_certificate.course_id);
