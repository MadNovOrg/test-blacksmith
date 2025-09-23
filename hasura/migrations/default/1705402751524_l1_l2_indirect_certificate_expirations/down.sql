UPDATE course_certificate AS cc
SET expiry_date = course.end + INTERVAL '3 years'
FROM course
WHERE cc.course_id = course.id
  AND course.course_level = 'LEVEL_1'
  AND course.course_type = 'INDIRECT'
  AND EXTRACT(YEAR FROM course.created_at) >= 2024;

UPDATE course_certificate AS cc
SET expiry_date = course.end + INTERVAL '2 years'
FROM course
WHERE cc.course_id = course.id
  AND course.course_level = 'LEVEL_2'
  AND course.course_type = 'INDIRECT'
  AND EXTRACT(YEAR FROM course.created_at) >= 2024;
