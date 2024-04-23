INSERT INTO "public"."profile_role" ("_source", "id", "profile_id", "role_id")
SELECT null,
       E'dce557c3-e58b-41fb-935d-b3bb06ff82e2',
       (SELECT "id" FROM "public"."profile" WHERE "_email" = 'sales.adm@teamteach.testinator.com' LIMIT 1),
       (SELECT "id" FROM "public"."role" WHERE "name" = 'sales-representative' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."profile_role"
    WHERE "profile_id" = (SELECT "id" FROM "public"."profile" WHERE "_email" = 'sales.adm@teamteach.testinator.com' LIMIT 1)
    AND "role_id" = (SELECT "id" FROM "public"."role" WHERE "name" = 'sales-representative' LIMIT 1)
) AND EXISTS (SELECT "id" FROM "public"."profile" WHERE "_email" = 'sales.adm@teamteach.testinator.com' LIMIT 1);


INSERT INTO "public"."profile_trainer_role_type" ("id", "profile_id", "trainer_role_type_id")
SELECT E'dbd350bd-0243-43c3-bc85-107ff05ce873',
       (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer@teamteach.testinator.com' LIMIT 1),
       (SELECT "id" FROM "public"."trainer_role_type" WHERE "name" = 'principal' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."profile_trainer_role_type"
    WHERE "profile_id" = (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer@teamteach.testinator.com' LIMIT 1)
    AND "trainer_role_type_id" = (SELECT "id" FROM "public"."trainer_role_type" WHERE "name" = 'principal' LIMIT 1)
) AND EXISTS (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer@teamteach.testinator.com' LIMIT 1);


INSERT INTO "public"."profile_trainer_role_type" ("id", "profile_id", "trainer_role_type_id")
SELECT E'81b2a960-d17d-4da6-afcd-a3e3feac106b',
       (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer.and.user@teamteach.testinator.com' LIMIT 1),
       (SELECT "id" FROM "public"."trainer_role_type" WHERE "name" = 'senior-assist' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."profile_trainer_role_type"
    WHERE "profile_id" = (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer.and.user@teamteach.testinator.com' LIMIT 1)
    AND "trainer_role_type_id" = (SELECT "id" FROM "public"."trainer_role_type" WHERE "name" = 'senior-assist' LIMIT 1)
) AND EXISTS (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer.and.user@teamteach.testinator.com' LIMIT 1);


INSERT INTO "public"."organization_member" ("is_admin", "member_type", "_source", "position", "id", "organization_id", "profile_id")
SELECT false,
       null,
       null,
       null,
       E'd1f9da01-ae8d-42cf-9eba-230862c6b6e6',
       (SELECT "id" FROM "organization" WHERE "name" = 'London First School'),
       (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer@teamteach.testinator.com' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."organization_member"
    WHERE "profile_id" = (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer@teamteach.testinator.com' LIMIT 1)
    AND "organization_id" = (SELECT "id" FROM "organization" WHERE "name" = 'London First School')
) AND EXISTS (SELECT "id" FROM "public"."profile" WHERE "_email" = 'trainer@teamteach.testinator.com' LIMIT 1);
