alter table "public"."course_certificate" add column "course_name" text
 null;
alter table "public"."course_certificate" add column "course_level" text
 null;

update "public"."course_certificate" set "course_name" = course.name, "course_level" = course.course_level
from "public"."course" course
join "public"."course_participant" part on course.id = part.course_id
where part.certificate_id = "public"."course_certificate".id;

alter table "public"."course_certificate" alter column "course_name" set not null;
alter table "public"."course_certificate" alter column "course_level" set not null;
