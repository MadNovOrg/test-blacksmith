DELETE FROM course_pricing_schedule
WHERE course_pricing_id IN (SELECT id FROM course_pricing WHERE (type = 'OPEN'and level = 'ADVANCED') OR type = 'INDIRECT');


DELETE FROM course_pricing
WHERE (type = 'OPEN' and level = 'ADVANCED') OR type = 'INDIRECT';
