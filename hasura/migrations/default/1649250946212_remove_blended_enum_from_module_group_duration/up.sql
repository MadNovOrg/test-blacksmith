
alter table "public"."module_group_duration" add column "go1_integration" boolean
 not null default 'false';

UPDATE module_group_duration SET course_delivery_type='F2F', go1_integration=true WHERE course_delivery_type='BLENDED';


