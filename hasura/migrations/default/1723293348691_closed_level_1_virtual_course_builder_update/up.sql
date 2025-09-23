DELETE FROM module_setting
WHERE course_type = 'CLOSED'
  AND course_level = 'LEVEL_1'
  AND course_delivery_type = 'VIRTUAL'
  AND module_name NOT IN ('Personal Space & Body Language', 'Theory');
