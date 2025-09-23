CREATE TABLE "public"."course_participant_note" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
    "participant_id" uuid NOT NULL, 
    "module_group_id" uuid NOT NULL, 
    "note" text NOT NULL, 
    "created_at" timestamptz DEFAULT now() NOT NULL, 
    "updated_at" timestamptz DEFAULT now(), 
    PRIMARY KEY ("id") , 
    FOREIGN KEY ("participant_id") REFERENCES "public"."course_participant"("id") ON UPDATE cascade ON DELETE cascade, 
    FOREIGN KEY ("module_group_id") REFERENCES "public"."module_group"("id") ON UPDATE cascade ON DELETE cascade, 
    UNIQUE ("id"), 
    UNIQUE ("participant_id", "module_group_id"));
    
COMMENT ON TABLE "public"."course_participant_note" IS E'Notes for each module group participant was graded for';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
