create table "public"."course_delivery_type"
(
    "name" text not null,
    primary key ("name"),
    unique ("name")
);

insert into "course_delivery_type"
values ('F2F'),
       ('BLENDED'),
       ('VIRTUAL');

alter table "public"."course"
    add column "course_delivery_type" text not null default 'f2f';
alter table "public"."course"
    alter column "course_delivery_type" drop default;

alter table "public"."course"
    add constraint "course_course_delivery_type_fkey"
        foreign key ("course_delivery_type")
            references "public"."course_delivery_type"
                ("name") on update restrict on delete restrict;

