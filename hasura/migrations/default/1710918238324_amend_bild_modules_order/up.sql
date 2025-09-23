-- Sets the BILD strategies sort orders at 100, 200, 300, 400, 500
-- to fit in regular modules between the strategies.
-- Previously, they were sorted separately and each had their order.
update bild_strategy
set "sort" = 100
where "name" = 'PRIMARY';

update bild_strategy
set "sort" = 200
where "name" = 'SECONDARY';

update bild_strategy
set "sort" = 300
where "name" = 'NON_RESTRICTIVE_TERTIARY';

update bild_strategy
set "sort" = 400
where "name" = 'RESTRICTIVE_TERTIARY_INTERMEDIATE';

update bild_strategy
set "sort" = 500
where "name" = 'RESTRICTIVE_TERTIARY_ADVANCED';

update module_setting
set "sort" = "sort" + 500
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
set "sort" = 201
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Physical Warm Up';

update module_setting
set "sort" = 202
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Separations';

update module_setting
set "sort" = 203
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Personal Safety';

update module_setting
set "sort" = 204
where
    "course_level" = 'BILD_ADVANCED_TRAINER'
    and ("course_type" = 'CLOSED' or "course_type" = 'OPEN')
    and "conversion" = false
    and "module_name" = 'Two Person Escorts';
