CREATE TABLE "public"."module_setting" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
    "course_level" text NOT NULL, 
    "reaccreditation" boolean NOT NULL, 
    "go1_integration" boolean NOT NULL, 
    "color" text NOT NULL, 
    "duration" integer NOT NULL, 
    "course_delivery_type" text NOT NULL, 
    "course_type" text NOT NULL, 
    "module_name" text NOT NULL, 
    "sort" integer not null,
    "mandatory" boolean not null,

    PRIMARY KEY ("id") , 
    FOREIGN KEY ("course_level") REFERENCES "public"."course_level"("name") ON UPDATE cascade ON DELETE cascade, 
    FOREIGN KEY ("color") REFERENCES "public"."color"("name") ON UPDATE cascade ON DELETE cascade, 
    FOREIGN KEY ("course_delivery_type") REFERENCES "public"."course_delivery_type"("name") ON UPDATE cascade ON DELETE cascade, 
    FOREIGN KEY ("course_type") REFERENCES "public"."course_type"("name") ON UPDATE cascade ON DELETE cascade, 
    FOREIGN KEY ("module_name") REFERENCES "public"."module_v2"("name") ON UPDATE cascade ON DELETE cascade, 
    
    UNIQUE ("id"));COMMENT ON TABLE "public"."module_setting" IS E'Settings for a module';

    alter table "public"."module_setting" add constraint "module_setting_go1_integration_course_level_reaccreditation_course_delivery_type_module_name_duration_sort_course_type_color_mandatory_key" 
    unique ("go1_integration", "course_level", "reaccreditation", "course_delivery_type", "module_name", "duration", "sort", "course_type", "color", "mandatory");
    
CREATE EXTENSION IF NOT EXISTS pgcrypto;
