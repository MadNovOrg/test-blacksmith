INSERT INTO "public"."course_level"("name") VALUES (E'FOUNDATION_TRAINER_PLUS');

INSERT INTO "public"."course_level_prefix"("name", "prefix") VALUES (E'FOUNDATION_TRAINER_PLUS', E'FTP');

UPDATE module
SET course_level = 'FOUNDATION_TRAINER_PLUS'
WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE module_setting
SET course_level = 'FOUNDATION_TRAINER_PLUS'
WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE module_group
SET course_level = 'FOUNDATION_TRAINER_PLUS'
WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE submodule
SET course_level = 'FOUNDATION_TRAINER_PLUS'
WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE course_certificate
SET course_level  = 'FOUNDATION_TRAINER_PLUS'
WHERE course_level  = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE course
SET course_level = 'FOUNDATION_TRAINER_PLUS'
WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE course_pricing
SET level = 'FOUNDATION_TRAINER_PLUS'
WHERE level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

UPDATE course_pricing
SET xero_code = 'FTP.OP'
WHERE xero_code = 'SRT.OP';

UPDATE course_pricing
SET xero_code = 'FTP.RE.OP'
WHERE xero_code = 'SRT.RE.OP';

UPDATE course_pricing
SET xero_code = 'FTP.CL'
WHERE xero_code = 'SRT.CL';

UPDATE course_pricing
SET xero_code = 'FTP.RE.CL'
WHERE xero_code = 'SRT.RE.CL';

DELETE FROM course_level_prefix
WHERE name = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';

DELETE FROM course_level
WHERE name = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';
