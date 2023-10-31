
UPDATE
    module_group
SET
    mandatory = true
WHERE
    course_level = 'LEVEL_1'
    AND name = 'Physical Warm Up';
UPDATE
    module_group
SET
    requires = NULL
WHERE
    course_level = 'LEVEL_1'
    AND name IN (
        'Bite Responses',
        'Clothing Responses',
        'Hair Responses',
        'Neck Disengagement',
        'Personal Safety',
        'Prompts and Guides',
        'Separations',
        'Small Child and One Person Holds'
    );
ALTER TABLE
    "public"."module_group" DROP COLUMN "requires";