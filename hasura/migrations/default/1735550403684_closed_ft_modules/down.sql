DELETE FROM course_pricing_schedule
WHERE course_pricing_id IN (
    SELECT id 
    FROM course_pricing 
    WHERE type = 'CLOSED' 
    AND level = 'FOUNDATION_TRAINER'
);

DELETE FROM course_pricing_changelog
WHERE course_pricing_id IN (
    SELECT id 
    FROM course_pricing 
    WHERE type = 'CLOSED' 
    AND level = 'FOUNDATION_TRAINER'
);

DELETE FROM course_pricing
WHERE type = 'CLOSED' 
AND level = 'FOUNDATION_TRAINER';

DELETE FROM module_setting
WHERE course_level = 'FOUNDATION_TRAINER'
  AND course_type = 'CLOSED'
  AND shard = 'ANZ';
