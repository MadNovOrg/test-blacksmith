
-- update profiles with admin, org-admin and mta-admin roles to tt-admin role
UPDATE "public"."profile_role" SET role_id = '88398629-b805-4630-8b27-672b2ba8e973' 
WHERE 
role_id = '4018e4f4-db34-4a3e-9490-e5458efe288b' 
OR role_id = 'd29e7b0a-cd9d-43e7-b917-f66fd9f7b5e5' 
OR role_id = '7a1efed5-5193-42bf-8144-45ad09936826';

UPDATE "public"."role" SET rank = '30' WHERE name = 'sales-representative';

UPDATE "public"."role" SET rank = '80' WHERE name = 'tt-admin';

UPDATE "public"."role" SET rank = '60' WHERE name = 'tt-ops';

INSERT INTO "public"."role"("id", "name", "data", "rank") VALUES (E'2405268a-5f38-4319-9207-22ccdd7b7d57', E'finance', '{}', 40);

INSERT INTO "public"."role"("id", "name", "data", "rank") VALUES (E'c20266af-3973-4edb-b08e-f17436132eed', E'sales-admin', '{}', 50);

INSERT INTO "public"."role"("id", "name", "data", "rank") VALUES (E'b99c9bb6-028d-4cab-a209-69f949b7b264', E'l&d', '{}', 70);

DELETE FROM "public"."role" WHERE "name" = 'mta-admin' OR "name" = 'org-admin';
