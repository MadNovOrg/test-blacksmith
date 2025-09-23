DELETE FROM module_setting
where course_level = 'FOUNDATION_TRAINER';

DELETE FROM module_v2 WHERE
"name" IN (
    'Foundation Trainer Theory', 
    'Foundation Trainer Communication',
    'Foundation Trainer Presentation',
    'Foundation Trainer How to run a Team Teach course'
);