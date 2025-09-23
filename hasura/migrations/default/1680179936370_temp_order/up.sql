CREATE TABLE order_temp (LIKE "order" INCLUDING ALL);

alter table "public"."order_temp"
  add constraint "order_temp_course_id_fkey"
  foreign key ("course_id")
  references "public"."course"
  ("id") on update cascade on delete cascade;

alter table "public"."order_temp"
  add constraint "order_temp_payment_method_fkey"
  foreign key ("payment_method")
  references "public"."payment_methods"
  ("name") on update cascade on delete restrict;
