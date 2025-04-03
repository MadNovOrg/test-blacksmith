INSERT INTO "public"."certificate_status"("name") VALUES (E'ON_HOLD');
INSERT INTO "public"."certificate_status"("name") VALUES (E'INACTIVE');

alter table "public"."course_certificate"
  add constraint "course_certificate_status_fkey"
  foreign key ("status")
  references "public"."certificate_status"
  ("name") on update cascade on delete cascade;
