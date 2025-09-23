CREATE TABLE "public"."certificate_status" ("name" text NOT NULL, PRIMARY KEY ("name") );

INSERT INTO "public"."certificate_status" (name) VALUES (E'EXPIRED'), (E'EXPIRED_RECENTLY'), (E'EXPIRING_SOON'), (E'ACTIVE');
