update bild_strategy
set "sort" = 1
where "name" = 'PRIMARY';

update bild_strategy
set "sort" = 2
where "name" = 'SECONDARY';

update bild_strategy
set "sort" = 3
where "name" = 'NON_RESTRICTIVE_TERTIARY';

update bild_strategy
set "sort" = 4
where "name" = 'RESTRICTIVE_TERTIARY_INTERMEDIATE';

update bild_strategy
set "sort" = 5
where "name" = 'RESTRICTIVE_TERTIARY_ADVANCED';

update module_setting
set "sort" = "sort" - 500
where "course_level" = 'BILD_ADVANCED_TRAINER'
    or "course_level" = 'BILD_INTERMEDIATE_TRAINER'
    or "course_level" = 'BILD_REGULAR';

update module_setting
set "sort" = 1
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Refresh of Intermediate Techniques';

update module_setting
set "sort" = 2
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Physical Warm Up';

update module_setting
set "sort" = 3
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Separations';

update module_setting
set "sort" = 4
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Personal Safety';

update module_setting
set "sort" = 5
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Two Person Escorts';

