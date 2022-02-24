
alter table "public"."course_participant" drop column "contact_details";
alter table "public"."course_participant" drop column "booking_date";
alter table "public"."course_participant" drop column "first_name";
alter table "public"."course_participant" drop column "last_name";
alter table "public"."course_participant" drop column "invoice_id";
alter table "public"."course_participant" drop constraint "course_participant_organization_id_fkey";
alter table "public"."course_participant" drop column "organization_id"