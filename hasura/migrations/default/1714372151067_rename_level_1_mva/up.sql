INSERT INTO "public"."course_level"("name") VALUES (E'LEVEL_1_BS');

INSERT INTO "public"."course_level_prefix"("name", "prefix") VALUES (E'LEVEL_1_BS', E'L1BS');

UPDATE course_certificate
SET course_level = 'LEVEL_1_BS'
WHERE course_level = 'LEVEL_1_MVA';

UPDATE course
SET course_level = 'LEVEL_1_BS'
WHERE course_level = 'LEVEL_1_MVA';

UPDATE course_pricing
SET level = 'LEVEL_1_BS'
WHERE level = 'LEVEL_1_MVA';

UPDATE course_pricing
SET xero_code = 'LEVEL1.BS.CL'
WHERE xero_code = 'LEVEL1.MVA.CL';

UPDATE course_pricing
SET xero_code = 'LEVEL1.BS.RE.CL'
WHERE xero_code = 'LEVEL1.MVA.RE.CL';

DELETE FROM course_level_prefix
WHERE name = 'LEVEL_1_MVA';

DELETE FROM course_level
WHERE name = 'LEVEL_1_MVA';