
alter table "public"."course_participant" add column "organization_id" uuid
 null;

alter table "public"."course_participant"
  add constraint "course_participant_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organization"
  ("id") on update restrict on delete restrict;

alter table "public"."course_participant" add column "first_name" text
 not null;

alter table "public"."course_participant" add column "last_name" text
 not null;

alter table "public"."course_participant" add column "invoice_id" uuid
 not null;

alter table "public"."course_participant" add column "booking_date" timestamptz
 null default now();

alter table "public"."course_participant" add column "contact_details" jsonb
 not null default '[]'::jsonb;
