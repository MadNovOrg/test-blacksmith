alter table "public"."course_certificate" add column "expiry_date" date
 null;

update "public"."course_certificate" set expiry_date = created_at + interval '12 months';

update "public"."course_certificate" certificate set expiry_date = certificate.created_at + interval '36 months'
from "public"."course_participant" participant
join "public"."course" course on participant.course_id = course.id
where course.course_level = 'LEVEL_1';

update "public"."course_certificate" set expiry_date = created_at + interval '24 months'
from "public"."course_participant" participant
join "public"."course" course on participant.course_id = course.id
where course.course_level = 'LEVEL_2';

alter table "public"."course_certificate" alter column "expiry_date" set not null;
