

CREATE TABLE non_graded_certificate (LIKE course_certificate INCLUDING ALL);
comment on table "public"."non_graded_certificate" is E'Temporary table to backup certificates that were issued for non-graded participants by mistake';

INSERT INTO non_graded_certificate
SELECT cc.*
FROM course_certificate cc
INNER JOIN course_participant cp ON cc.id = cp.certificate_id
WHERE cp.grade IS NULL
AND cc.legacy_course_code IS NULL;

DELETE FROM course_certificate cc
USING course_participant cp
WHERE cc.id = cp.certificate_id AND cp.grade IS NULL
AND cc.legacy_course_code IS NULL;

