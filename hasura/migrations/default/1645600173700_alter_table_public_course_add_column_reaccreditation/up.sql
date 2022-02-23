alter table "public"."course"
    add column "reaccreditation" boolean
        null default 'false';

alter table "public"."module"
    add column "course_level" text not null default 'LEVEL_1'::text;
alter table "public"."module"
    alter column "course_level" drop default;

update "public"."module"
set course_level = 'LEVEL_2'
where module_level = 2;
update "public"."module"
set course_level = 'ADVANCED'
where module_level = 3;

alter table "public"."module"
    drop column "module_level" cascade;

alter table "public"."module"
    add constraint "module_course_level_fkey"
        foreign key ("course_level")
            references "public"."course_level"
                ("name") on update restrict on delete restrict;

alter table "public"."module_group"
    add column "course_level" text not null default 'LEVEL_1'::text;
alter table "public"."module_group"
    alter column "course_level" drop default;

update "public"."module_group"
set course_level = 'LEVEL_2'
where module_level = 2;
update "public"."module_group"
set course_level = 'ADVANCED'
where module_level = 3;

alter table "public"."module_group"
    drop column "module_level" cascade;

alter table "public"."module_group"
    add constraint "module_group_course_level_fkey"
        foreign key ("course_level")
            references "public"."course_level"
                ("name") on update restrict on delete restrict;
