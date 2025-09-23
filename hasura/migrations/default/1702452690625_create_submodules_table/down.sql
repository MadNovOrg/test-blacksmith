alter table submodule DROP CONSTRAINT submodule_pkey;
alter table submodule DROP CONSTRAINT submodule_course_level_fkey;
alter table submodule DROP CONSTRAINT submodule_category_fkey;
alter table submodule DROP CONSTRAINT submodule_module_id_fkey;

Drop TABLE submodule;

DELETE FROM module WHERE 
    module_group_id IN (SELECT id from module_group WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER');

DELETE FROM module_group_duration WHERE 
    module_group_id IN (SELECT id from module_group WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER');

DELETE FROM module_group WHERE 
    id IN (SELECT id from module_group WHERE course_level = 'THREE_DAY_SAFETY_RESPONSE_TRAINER');
