
alter table "public"."course_certificate" add column "course_accredited_by" text not null default 'ICM';

alter table "public"."course_certificate" add column "blended_learning" boolean not null default false;

alter table "public"."course_certificate" add column "reaccreditation" boolean not null default false;

alter table "public"."course_certificate"
  add constraint "course_certificate_course_accredited_by_fkey"
  foreign key ("course_accredited_by")
  references "public"."accreditors"
  ("name") on update cascade on delete no action;