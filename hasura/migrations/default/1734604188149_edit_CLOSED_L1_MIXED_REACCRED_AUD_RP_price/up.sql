UPDATE anz_resource_packs_pricing
SET price = 52
WHERE course_type = 'CLOSED' AND course_level = 'LEVEL_1' AND course_delivery_type = 'MIXED' AND reaccred = true AND currency = 'AUD';