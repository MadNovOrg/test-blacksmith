
alter table "public"."course_participant" add column "order_id" uuid
 null;

alter table "public"."course_participant"
  add constraint "course_participant_order_id_fkey"
  foreign key ("order_id")
  references "public"."order"
  ("id") on update set null on delete set null;
