
DELETE FROM "public"."role" WHERE "id" = 'b99c9bb6-028d-4cab-a209-69f949b7b264';

DELETE FROM "public"."role" WHERE "id" = 'c20266af-3973-4edb-b08e-f17436132eed';

INSERT INTO "public"."role"("id", "name", "data", "rank") VALUES 
(E'd29e7b0a-cd9d-43e7-b917-f66fd9f7b5e5', E'org-admin', '{}', 30),
(E'7a1efed5-5193-42bf-8144-45ad09936826', E'mta-admin', '{}', 40);
DELETE FROM "public"."role" WHERE "id" = '2405268a-5f38-4319-9207-22ccdd7b7d57';

UPDATE "public"."role" SET rank = '50' WHERE name = 'tt-ops';
UPDATE "public"."role" SET rank = '60' WHERE name = 'tt-admin';
UPDATE "public"."role" SET rank = '15' WHERE name = 'sales-representative';
