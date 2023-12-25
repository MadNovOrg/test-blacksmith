UPDATE module_setting
SET module_name = 'Prompts & Guides'
WHERE course_level IN ('LEVEL_1', 'LEVEL_2') 
AND module_name = 'Prompts and Guides';

DELETE FROM module_v2
WHERE name = 'Prompts and Guides'