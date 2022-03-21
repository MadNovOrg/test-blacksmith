
CREATE TABLE "public"."grade" ("name" text NOT NULL, PRIMARY KEY ("name") );COMMENT ON TABLE "public"."grade" IS E'Enum table for possible course grades';

INSERT INTO "public"."grade"("name") VALUES (E'PASS');

INSERT INTO "public"."grade"("name") VALUES (E'OBSERVE_ONLY');

INSERT INTO "public"."grade"("name") VALUES (E'FAIL');
