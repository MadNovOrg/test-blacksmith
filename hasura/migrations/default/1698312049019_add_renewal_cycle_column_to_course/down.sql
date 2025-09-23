alter table "public"."course" drop constraint "course_renewal_cycle_fkey";

alter table "public"."course" drop column "renewal_cycle";