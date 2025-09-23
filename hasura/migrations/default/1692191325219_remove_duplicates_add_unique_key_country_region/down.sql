
alter table "public"."country_region" drop constraint "country_region_country_name_key";

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rotherham', E'2023-08-11T12:23:09.209919+00:00', E'2023-08-11T12:23:09.209919+00:00', E'10eb5b97-a889-47ac-be20-7c5929569c21');