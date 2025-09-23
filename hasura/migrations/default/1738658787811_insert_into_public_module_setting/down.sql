DELETE FROM "public"."module_v2" WHERE "id" = '3d65bc4a-1bcf-48c0-a6a4-a33d2bae4b56';

DELETE FROM "public"."module_setting" 
WHERE course_level = 'LEVEL_1'
AND course_type = 'OPEN'
AND module_name in ('Small Child and One Person Holds', 'Separations', 'Neck Disengagement');
