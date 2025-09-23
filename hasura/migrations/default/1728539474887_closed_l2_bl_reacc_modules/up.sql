INSERT INTO module_setting (
  course_level, 
  course_delivery_type, 
  course_type, 
  go1_integration, 
  reaccreditation, 
  module_name, 
  mandatory, 
  color, 
  duration, 
  sort
)
SELECT 
  course_level, 
  course_delivery_type, 
  course_type, 
  TRUE,
  TRUE,
  module_name, 
  mandatory, 
  color, 
  duration, 
  sort
FROM module_setting
WHERE course_level = 'LEVEL_2'
  AND (course_delivery_type = 'F2F' OR course_delivery_type = 'MIXED')
  AND course_type = 'CLOSED'
  AND go1_integration = FALSE
  AND reaccreditation = TRUE;
