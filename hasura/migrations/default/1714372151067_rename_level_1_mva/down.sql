INSERT INTO "public"."course_level"("name") VALUES (E'LEVEL_1_MVA');

INSERT INTO "public"."course_level_prefix"("name", "prefix") VALUES (E'LEVEL_1_MVA', E'L1MVA');

UPDATE course_certificate
SET course_level = 'LEVEL_1_MVA'
WHERE course_level = 'LEVEL_1_BS';

UPDATE course
SET course_level = 'LEVEL_1_MVA'
WHERE course_level = 'LEVEL_1_BS';

UPDATE course_pricing
SET level = 'LEVEL_1_MVA'
WHERE level = 'LEVEL_1_BS';

UPDATE course_pricing
SET xero_code = 'LEVEL1.MVA.CL'
WHERE xero_code = 'LEVEL1.BS.CL';

UPDATE course_pricing
SET xero_code = 'LEVEL1.MVA.RE.CL'
WHERE xero_code = 'LEVEL1.BS.RE.CL';

DELETE FROM course_level_prefix
WHERE name = 'LEVEL_1_BS';

DELETE FROM course_level
WHERE name = 'LEVEL_1_BS';