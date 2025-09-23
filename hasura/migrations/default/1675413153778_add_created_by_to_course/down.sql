
alter table "public"."course" drop constraint "course_created_by_id_fkey";
alter table "public"."course" drop column "created_by_id";
