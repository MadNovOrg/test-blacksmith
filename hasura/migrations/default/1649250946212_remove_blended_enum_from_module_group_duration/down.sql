
UPDATE module_group_duration SET course_delivery_type='BLENDED' WHERE course_delivery_type='F2F' AND go1_integration=true;

alter table "public"."module_group_duration" drop column "go1_integration";