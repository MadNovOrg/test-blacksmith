alter table "public"."course" add column "renewal_cycle" text
 null;

alter table "public"."course"
  add constraint "course_renewal_cycle_fkey"
  foreign key ("renewal_cycle")
  references "public"."course_renewal_cycle"
  ("value") on update no action on delete no action;