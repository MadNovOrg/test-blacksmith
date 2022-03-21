
DELETE FROM "public"."grade" WHERE "name" = 'FAIL';

DELETE FROM "public"."grade" WHERE "name" = 'OBSERVE_ONLY';

DELETE FROM "public"."grade" WHERE "name" = 'PASS';

DROP TABLE "public"."grade";
