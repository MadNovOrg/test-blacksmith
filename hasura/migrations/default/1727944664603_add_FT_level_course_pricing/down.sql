DELETE FROM course_pricing_schedule where course_pricing_id IN (SELECT id from course_pricing WHERE level = 'FOUNDATION_TRAINER');
DELETE FROM course_pricing_changelog where course_pricing_id IN (SELECT id from course_pricing WHERE level = 'FOUNDATION_TRAINER');
DELETE FROM course_pricing WHERE level = 'FOUNDATION_TRAINER';