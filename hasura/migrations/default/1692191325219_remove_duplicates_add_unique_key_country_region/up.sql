
DELETE FROM "public"."country_region" WHERE "id" = '10eb5b97-a889-47ac-be20-7c5929569c21';
alter table "public"."country_region" add constraint "country_region_country_name_key" unique ("country", "name");
