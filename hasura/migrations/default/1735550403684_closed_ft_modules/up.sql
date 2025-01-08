INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard")
SELECT course_level, reaccreditation, TRUE, color, duration, course_delivery_type, 'CLOSED', module_name, sort, mandatory, conversion, 'ANZ'
FROM module_setting
WHERE course_level = 'FOUNDATION_TRAINER'
  AND go1_integration = FALSE
  AND course_type = 'OPEN'
  AND shard = 'ANZ';

INSERT INTO course_pricing (
    "type", 
    "level", 
    "blended", 
    "reaccreditation", 
    "price_amount", 
    "price_currency", 
    "xero_code"
) 
VALUES 
    ('CLOSED', 'FOUNDATION_TRAINER', true, false, 0, 'AUD', 'FT.CL'),
    ('CLOSED', 'FOUNDATION_TRAINER', true, true, 0, 'AUD', 'FT.RE.CL');

