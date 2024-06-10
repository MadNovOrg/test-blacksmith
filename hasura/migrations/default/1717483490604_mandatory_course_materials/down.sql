alter table "public"."course_expenses" alter column "trainer_id" set not null;
alter table "public"."course" drop column "mandatory_course_materials";