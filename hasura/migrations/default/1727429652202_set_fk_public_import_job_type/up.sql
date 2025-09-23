alter table "public"."import_job"
  add constraint "import_job_type_fkey"
  foreign key ("type")
  references "public"."import_job_type"
  ("name") on update restrict on delete restrict;
