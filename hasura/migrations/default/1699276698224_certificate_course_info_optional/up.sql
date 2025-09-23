
alter table "public"."course_certificate" alter column "blended_learning" drop not null;
alter table "public"."course_certificate" alter column "reaccreditation" drop not null;
alter table "public"."course_certificate" alter column "course_accredited_by" drop not null;

-- populate fields for existing certificates
UPDATE course_certificate
SET blended_learning = (select go1_integration from course where course.id = course_certificate.course_id);

UPDATE course_certificate
SET reaccreditation = (select reaccreditation from course where course.id = course_certificate.course_id);

UPDATE course_certificate
SET course_accredited_by = (select accredited_by from course where course.id = course_certificate.course_id);