DELETE FROM "public"."module_setting" WHERE "course_level" = 'LEVEL_1_BS' AND "course_type" = 'CLOSED';

DELETE FROM "public"."module_v2" WHERE "name" ILIKE '%Level 1 BS%' AND "name" NOT ILIKE '%Indirect%';