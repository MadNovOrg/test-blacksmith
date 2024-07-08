UPDATE course
SET mandatory_course_materials = max_participants - mandatory_course_materials;

ALTER TABLE course
RENAME mandatory_course_materials TO free_course_materials;
