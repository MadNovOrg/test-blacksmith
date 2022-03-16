alter table "public"."role" add column "rank" integer null;

-- Add missing roles and set ranks
UPDATE "public"."role" SET "name" = 'user', "rank" = 10 WHERE "name" = 'participant';
UPDATE "public"."role" SET "rank" = 20 WHERE "name" = 'trainer';
INSERT INTO "public"."role"("id", "name", "rank") VALUES (E'd29e7b0a-cd9d-43e7-b917-f66fd9f7b5e5', E'org-admin', 30);
INSERT INTO "public"."role"("id", "name", "rank") VALUES (E'7a1efed5-5193-42bf-8144-45ad09936826', E'mta-admin', 40);
UPDATE "public"."role" SET "rank" = 50 WHERE "name" = 'tt-ops';
UPDATE "public"."role" SET "rank" = 60 WHERE "name" = 'tt-admin';
INSERT INTO "public"."role"("id", "name", "rank") VALUES (E'4018e4f4-db34-4a3e-9490-e5458efe288b', E'admin', 100);
