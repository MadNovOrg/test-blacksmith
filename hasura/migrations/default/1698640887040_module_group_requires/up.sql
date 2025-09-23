
alter table "public"."module_group" add column "requires" jsonb
 null;

UPDATE module_group
SET requires = jsonb_build_array((SELECT id FROM module_group WHERE course_level = 'LEVEL_1' AND name = 'Physical Warm Up' LIMIT 1))
WHERE course_level = 'LEVEL_1'
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

UPDATE module_group
SET mandatory = false
WHERE course_level = 'LEVEL_1' AND name = 'Physical Warm Up';
