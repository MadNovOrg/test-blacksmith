alter table "public"."module_group"
    drop constraint "module_group_course_level_fkey";

alter table "public"."module_group"
    add column "module_level" integer NOT NULL default 1;
alter table "public"."module_group"
    alter column "module_level" drop default;

update "public"."module_group"
set module_level = 2
where course_level = 'LEVEL_2';

update "public"."module_group"
set module_level = 3
where course_level = 'ADVANCED';

alter table "public"."module_group"
    drop column "course_level";

alter table "public"."module"
    drop constraint "module_course_level_fkey";

alter table "public"."module"
    add column "module_level" integer NOT NULL default 1;
alter table "public"."module"
    alter column "module_level" drop default;

update "public"."module"
set module_level = 2
where course_level = 'LEVEL_2';

update "public"."module"
set module_level = 3
where course_level = 'ADVANCED';

alter table "public"."module"
    drop column "course_level";

alter table "public"."course"
    drop column "reaccreditation";
