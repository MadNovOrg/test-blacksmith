CREATE TABLE "public"."course_participant_grading" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
    "grade" text NOT NULL, 
    "course_participant_id" uuid NOT NULL, 
    "module_id" uuid NOT NULL, 
    "feedback" text, 
    PRIMARY KEY ("id") , 
    FOREIGN KEY ("grade") REFERENCES "public"."grade"("name") ON UPDATE restrict ON DELETE restrict, 
    FOREIGN KEY ("course_participant_id") REFERENCES "public"."course_participant"("id") ON UPDATE restrict ON DELETE restrict, 
    FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON UPDATE restrict ON DELETE restrict, 
    UNIQUE ("course_participant_id", "module_id"));
    COMMENT ON TABLE "public"."course_participant_grading" IS E'Grading a course participant for each module';
