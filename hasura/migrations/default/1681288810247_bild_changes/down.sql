
alter table "public"."course_bild_strategy" drop constraint "course_bild_strategy_strategy_name_fkey";

alter table "public"."course_bild_strategy" drop constraint "course_bild_strategy_course_id_fkey";

alter table "public"."course_bild_module" drop constraint "course_bild_module_course_id_fkey";

DROP TABLE "public"."course_bild_module";

DROP TABLE "public"."bild_strategy";

DROP TABLE "public"."course_bild_strategy";

alter table "public"."course" drop constraint "course_accredited_by_fkey";
alter table "public"."course" drop column "accredited_by";

DROP TABLE "public"."accreditors";

delete from "public"."course_level"
where name in ('BILD_REGULAR', 'BILD_INTERMEDIATE_TRAINER', 'BILD_ADVANCED_TRAINER');

insert into "public"."course_level"(name)
values ('BILD_ACT'), ('BILD_ACT_TRAINER');
