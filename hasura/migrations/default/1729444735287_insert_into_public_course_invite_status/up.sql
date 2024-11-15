INSERT INTO "public"."course_invite_status" ("name") 
VALUES (E'CANCELLED')
ON CONFLICT ("name") DO NOTHING;
