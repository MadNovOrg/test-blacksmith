UPDATE course
SET free_course_materials = max_participants - free_course_materials;

ALTER TABLE course
RENAME free_course_materials TO mandatory_course_materials;
