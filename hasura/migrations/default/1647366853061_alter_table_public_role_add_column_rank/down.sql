alter table "public"."role" drop column "rank";

UPDATE "public"."role" SET "name" = 'participant' WHERE "id" = '151f0884-a8c8-48e2-a619-c4434864ea67';

DELETE FROM "public"."role" WHERE "id" = 'd29e7b0a-cd9d-43e7-b917-f66fd9f7b5e5';
DELETE FROM "public"."role" WHERE "id" = '7a1efed5-5193-42bf-8144-45ad09936826';
DELETE FROM "public"."role" WHERE "id" = '4018e4f4-db34-4a3e-9490-e5458efe288b';
