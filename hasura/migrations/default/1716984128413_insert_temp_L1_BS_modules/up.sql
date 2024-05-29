-- to unblock other tickets, the exact modules are not known yet and this should be overwritten

INSERT INTO "module_setting" (
    "course_level",
    "reaccreditation",
    "go1_integration",
    "color",
    "duration",
    "course_delivery_type",
    "course_type",
    "module_name",
    "sort",
    "mandatory",
    "conversion")
SELECT
    "course_level",
    "reaccreditation",
    "go1_integration",
    "color",
    "duration",
    "course_delivery_type",
    'INDIRECT' as "course_type",
    "module_name",
    "sort",
    "mandatory",
    "conversion"
FROM "module_setting"
WHERE
    "course_type" = 'CLOSED'
    AND "course_level" = 'LEVEL_1_BS';