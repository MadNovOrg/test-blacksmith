
alter table "public"."order_temp" rename column "attendeesQuantity" to "quantity";

alter table "public"."order" add column "course_id" int4;
alter table "public"."order" alter column "course_id" drop not null;
alter table "public"."order"
  add constraint "order_course_id_fkey"
  foreign key (course_id)
  references "public"."course"
  (id) on update restrict on delete restrict;

alter table "public"."order" rename column "attendeesQuantity" to "quantity";

DROP table course_order;
