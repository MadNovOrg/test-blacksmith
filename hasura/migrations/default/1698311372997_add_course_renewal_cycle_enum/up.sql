CREATE TABLE "public"."course_renewal_cycle" ("value" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));COMMENT ON TABLE "public"."course_renewal_cycle" IS E'Enum table for available course renewal cycles';

INSERT INTO course_renewal_cycle("value") VALUES ('ONE'), ('TWO'), ('THREE');