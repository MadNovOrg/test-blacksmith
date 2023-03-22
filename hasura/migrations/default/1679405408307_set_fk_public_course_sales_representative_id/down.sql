alter table "public"."course" drop constraint "course_sales_representative_id_fkey",
  add constraint "course_sales_representative_id_fkey"
  foreign key ("sales_representative_id")
  references "public"."profile"
  ("id") on update restrict on delete restrict;
