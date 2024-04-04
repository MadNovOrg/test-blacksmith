delete from module_v2
where "name" = 'Elevated Risks 3 Day SRT';

update module_setting
set "module_name" = 'Elevated Risks'
where "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER'
    and "module_name" = 'Elevated Risks 3 Day SRT';