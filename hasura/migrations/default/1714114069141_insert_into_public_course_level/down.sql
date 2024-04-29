INSERT INTO "public"."course_level"("name") VALUES (E'THREE_DAY_SAFETY_RESPONSE_TRAINER');

INSERT INTO "public"."course_level_prefix"("name", "prefix", "id") VALUES (E'THREE_DAY_SAFETY_RESPONSE_TRAINER', E'SRT', E'e65598e5-f4a8-47b8-bd4d-37e951bce883');

UPDATE module
SET course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE module_setting
SET course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE module_group
SET course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE submodule
SET course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_certificate
SET course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course
SET course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE course_level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_pricing
SET level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
WHERE level = 'FOUNDATION_TRAINER_PLUS';

UPDATE course_pricing
SET xero_code = 'SRT.OP'
WHERE xero_code = 'FTP.OP';

UPDATE course_pricing
SET xero_code = 'SRT.RE.OP'
WHERE xero_code = 'FTP.RE.OP';

UPDATE course_pricing
SET xero_code = 'SRT.CL'
WHERE xero_code = 'FTP.CL';

UPDATE course_pricing
SET xero_code = 'SRT.RE.CL'
WHERE xero_code = 'FTP.RE.CL';

DELETE FROM course_level_prefix
WHERE name = 'FOUNDATION_TRAINER_PLUS';

DELETE FROM "public"."course_level" WHERE "name" = 'FOUNDATION_TRAINER_PLUS';
