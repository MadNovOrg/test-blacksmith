CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."module_setting_dependency" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
    "module_setting_id" uuid NOT NULL, 
    "module_setting_dependency_id" uuid NOT NULL,
    PRIMARY KEY ("id"), 
    FOREIGN KEY ("module_setting_id") REFERENCES "public"."module_setting"("id") ON UPDATE cascade ON DELETE cascade
);
    
COMMENT ON TABLE "public"."module_setting_dependency" IS E'Dependencies between module settings';

alter table "public"."module_setting_dependency" add constraint "module_setting_dependency_module_setting_id_module_setting_dependency_id_key" unique ("module_setting_id", "module_setting_dependency_id");

alter table "public"."module_setting_dependency"
  add constraint "module_setting_dependency_module_setting_dependency_id_fkey"
  foreign key ("module_setting_dependency_id")
  references "public"."module_setting"
  ("id") on update cascade on delete cascade;
