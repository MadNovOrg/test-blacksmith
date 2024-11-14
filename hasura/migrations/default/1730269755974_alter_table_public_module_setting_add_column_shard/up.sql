alter table "public"."module_setting" add column "shard" text
 not null default 'UK';

UPDATE module_setting SET shard = 'ANZ' WHERE course_level = 'FOUNDATION_TRAINER';