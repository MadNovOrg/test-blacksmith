UPDATE course_certificate cc
SET certification_date = cs.end
FROM course c
JOIN course_schedule cs ON c.id = cs.course_id
WHERE cc.course_id = c.id
  AND cc.legacy_course_code IS NULL
  AND cc.created_at >= CURRENT_DATE - INTERVAL '10 months';
