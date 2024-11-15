INSERT INTO "public"."course_audit_type" ("name") 
VALUES ('COMPLETED')
ON CONFLICT ("name") DO NOTHING;
