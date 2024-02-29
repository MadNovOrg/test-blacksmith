
-- Rollback the DELETE operation
INSERT INTO course_certificate
SELECT * FROM non_graded_certificate;

-- Drop the temporary table
DROP TABLE IF EXISTS non_graded_certificate;