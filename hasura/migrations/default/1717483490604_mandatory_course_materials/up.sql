alter table "public"."course_expenses" alter column "trainer_id" drop not null;
alter table "public"."course" add column "mandatory_course_materials" integer
 null;