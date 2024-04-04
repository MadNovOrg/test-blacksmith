insert into "module_setting" (
    "course_level",
    "reaccreditation",
    "go1_integration",
    "color",
    "duration",
    "course_delivery_type",
    "module_name",
    "sort",
    "mandatory",
    "conversion",
    "course_type"
)
select 
    "course_level",
    "reaccreditation",
    "go1_integration",
    "color",
    "duration",
    "course_delivery_type",
    "module_name",
    "sort",
    "mandatory",
    "conversion",
    'CLOSED' as "course_type"
from "module_setting"
where
    "course_type" = 'OPEN'
    and "course_level" = 'THREE_DAY_SAFETY_RESPONSE_TRAINER';
