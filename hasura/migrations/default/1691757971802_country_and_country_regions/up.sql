
CREATE TABLE "public"."country" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));


INSERT INTO "public"."country"("name") VALUES (E'England');

INSERT INTO "public"."country"("name") VALUES (E'Scotland');

INSERT INTO "public"."country"("name") VALUES (E'Wales');

CREATE TABLE "public"."country_region" ("name" text NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "country" Text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("country") REFERENCES "public"."country"("name") ON UPDATE cascade ON DELETE cascade);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_country_region_updated_at"
BEFORE UPDATE ON "public"."country_region"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_country_region_updated_at" ON "public"."country_region"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."country_region" drop constraint "country_region_country_fkey",
  add constraint "country_region_country_fkey"
  foreign key ("country")
  references "public"."country"
  ("name") on update restrict on delete restrict;


INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'York', E'05c19eaf-beb4-4992-b444-9dd86aadce03', E'2023-08-11T11:45:51.335362+00:00', E'2023-08-11T11:45:51.335362+00:00', E'England');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Derby', E'2023-08-11T11:47:51.839989+00:00', E'2023-08-11T11:47:51.839989+00:00', E'071d1bbd-f098-415e-874a-f531a32a126d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bolsover', E'2023-08-11T11:48:09.308648+00:00', E'2023-08-11T11:48:09.308648+00:00', E'faae069c-e442-4ae4-92c9-478a9afde9e8');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Erewash', E'2023-08-11T11:48:14.214067+00:00', E'2023-08-11T11:48:14.214067+00:00', E'4234465e-4269-47a0-ae72-a66ffbded956');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'High Peak', E'2023-08-11T11:48:18.933551+00:00', E'2023-08-11T11:48:18.933551+00:00', E'e56ccf3d-71e2-40ed-bff2-63250796aa70');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Derbyshire', E'2023-08-11T11:48:23.163787+00:00', E'2023-08-11T11:48:23.163787+00:00', E'6e6fec65-f531-4f14-a1dd-79f9b89084a1');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Amber Valley', E'2023-08-11T11:48:28.286903+00:00', E'2023-08-11T11:48:28.286903+00:00', E'7eecc267-dc09-49b2-ada5-c143796372bf');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Chesterfield', E'2023-08-11T11:48:33.279881+00:00', E'2023-08-11T11:48:33.279881+00:00', E'255d39c9-5392-4018-b2f8-20ef46c498f2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Derbyshire Dales', E'2023-08-11T11:48:39.21743+00:00', E'2023-08-11T11:48:39.21743+00:00', E'9d0cdc54-61eb-4a22-b3f3-83abb3e413a2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North East Derbyshire', E'2023-08-11T11:48:43.50804+00:00', E'2023-08-11T11:48:43.50804+00:00', E'e1526674-d7c4-44f9-8bf5-1367f1c911ad');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Leicester', E'2023-08-11T11:48:48.12735+00:00', E'2023-08-11T11:48:48.12735+00:00', E'8947ad64-f5e6-45ec-82c1-00f1ef0b7a3b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Oadby and Wigston', E'2023-08-11T11:48:56.756703+00:00', E'2023-08-11T11:48:56.756703+00:00', E'ccfbc39c-e4c0-4afc-b662-844d04b10e45');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Harborough', E'2023-08-11T11:49:01.562899+00:00', E'2023-08-11T11:49:01.562899+00:00', E'9ba2e56b-4a52-4a9b-9b44-09b04bb70909');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Charnwood', E'2023-08-11T11:49:05.83708+00:00', E'2023-08-11T11:49:05.83708+00:00', E'1727e2b7-d07c-4e9a-ba85-215ba68a90ec');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North West Leicestershire', E'2023-08-11T11:49:10.829076+00:00', E'2023-08-11T11:49:10.829076+00:00', E'ca316fd3-fd84-4da9-88d9-065045ce8972');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Melton', E'2023-08-11T11:49:15.056156+00:00', E'2023-08-11T11:49:15.056156+00:00', E'fe3f896f-cad8-48b4-9c3e-022800c4dc19');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hinckley and Bosworth', E'2023-08-11T11:49:19.205237+00:00', E'2023-08-11T11:49:19.205237+00:00', E'85445c44-f656-4a1a-8ed2-fbde00a20e98');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Blaby', E'2023-08-11T11:49:24.32317+00:00', E'2023-08-11T11:49:24.32317+00:00', E'4e58ac17-56ce-4478-8ae6-a2248081fc93');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Lindsey', E'2023-08-11T11:49:28.744076+00:00', E'2023-08-11T11:49:28.744076+00:00', E'268780ea-2183-4297-89ee-51477ac89a69');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Holland', E'2023-08-11T11:49:32.652463+00:00', E'2023-08-11T11:49:32.652463+00:00', E'344f3775-f470-42f6-8f85-7403c4554beb');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Kesteven', E'2023-08-11T11:49:36.939706+00:00', E'2023-08-11T11:49:36.939706+00:00', E'4a0b383a-3028-4365-b624-18dd0a2c0790');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Boston', E'2023-08-11T11:49:41.382147+00:00', E'2023-08-11T11:49:41.382147+00:00', E'cb44d7a9-195a-48f9-96f5-046bbf3a116e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Kesteven', E'2023-08-11T11:49:45.678701+00:00', E'2023-08-11T11:49:45.678701+00:00', E'59e39c72-bac7-4815-a36a-65ab5539692c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Lincoln', E'2023-08-11T11:49:49.355512+00:00', E'2023-08-11T11:49:49.355512+00:00', E'8f99002e-ab1b-492e-9deb-63abae0b1bf2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Lindsey', E'2023-08-11T11:49:53.454536+00:00', E'2023-08-11T11:49:53.454536+00:00', E'e85aec24-1c8f-44a7-a4d7-46ebe97939a7');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Northamptonshire', E'2023-08-11T11:50:00.386881+00:00', E'2023-08-11T11:50:00.386881+00:00', E'86a018f2-48b9-4be9-9300-3ad0b33349ef');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Nottingham', E'2023-08-11T11:50:04.66789+00:00', E'2023-08-11T11:50:04.66789+00:00', E'6dcc9446-4af9-4bf8-9fdb-d8a0d4627ede');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Gedling', E'2023-08-11T11:50:08.911362+00:00', E'2023-08-11T11:50:08.911362+00:00', E'04bb294d-264a-4993-b6c0-a6b5da555e3b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Broxtowe', E'2023-08-11T11:50:13.127062+00:00', E'2023-08-11T11:50:13.127062+00:00', E'fddb40de-cd37-4de8-abc7-acb7762d1d86');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Newark and Sherwood', E'2023-08-11T11:50:17.001663+00:00', E'2023-08-11T11:50:17.001663+00:00', E'4cd99914-baed-4ef1-9413-1a0372ce56af');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Ashfield', E'2023-08-11T11:50:20.72982+00:00', E'2023-08-11T11:50:20.72982+00:00', E'767704dd-28d8-46c1-a540-c80ddb609262');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rushcliffe', E'2023-08-11T11:50:24.201723+00:00', E'2023-08-11T11:50:24.201723+00:00', E'b5262566-24ea-4eef-a089-e482c245d512');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Mansfield', E'2023-08-11T11:50:28.013018+00:00', E'2023-08-11T11:50:28.013018+00:00', E'9fea79a4-21dc-4f7d-867a-f57953b1e64a');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bassetlaw', E'2023-08-11T11:50:32.783283+00:00', E'2023-08-11T11:50:32.783283+00:00', E'cc8ff44c-0fcb-4782-bd88-ea8765f833db');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rutland', E'2023-08-11T11:50:36.251133+00:00', E'2023-08-11T11:50:36.251133+00:00', E'a2a8259d-36f7-4f09-8aed-9bf91a5c60b3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Northamptonshire', E'2023-08-11T11:50:41.834513+00:00', E'2023-08-11T11:50:41.834513+00:00', E'9800046d-bfb2-4174-94b1-2ac02e49f19c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bedford', E'2023-08-11T11:50:48.179139+00:00', E'2023-08-11T11:50:48.179139+00:00', E'4da487e7-cd2b-437b-a2a8-c96f85461549');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Fenland', E'2023-08-11T11:50:52.641381+00:00', E'2023-08-11T11:50:52.641381+00:00', E'9f35049e-97d1-4443-9de0-d2b73fe21915');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Huntingdonshire', E'2023-08-11T11:50:57.336405+00:00', E'2023-08-11T11:50:57.336405+00:00', E'9511be5d-f3ee-45dd-be38-7d7ee869da92');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cambridge', E'2023-08-11T11:51:03.845998+00:00', E'2023-08-11T11:51:03.845998+00:00', E'7977e321-2fa8-4bf2-b64b-59cc1a0ee342');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Cambridgeshire', E'2023-08-11T11:51:07.913563+00:00', E'2023-08-11T11:51:07.913563+00:00', E'a175bf3e-d469-43e4-ab23-f3a0db877cbc');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Cambridgeshire', E'2023-08-11T11:51:18.48294+00:00', E'2023-08-11T11:51:18.48294+00:00', E'61098e83-bab4-4b8c-9dbe-bb2d1b25251a');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Central Bedfordshire', E'2023-08-11T11:51:26.625331+00:00', E'2023-08-11T11:51:26.625331+00:00', E'9815cd6b-bf97-46b4-90f1-6d3cee02e488');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Harlow', E'2023-08-11T11:51:31.423139+00:00', E'2023-08-11T11:51:31.423139+00:00', E'a1a5a4a6-5b4e-4b58-b752-ae870a3320c4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Braintree', E'2023-08-11T11:51:36.35412+00:00', E'2023-08-11T11:51:36.35412+00:00', E'79c1cd5d-1783-4758-a3a1-dca15398e831');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Epping Forest', E'2023-08-11T11:51:42.162231+00:00', E'2023-08-11T11:51:42.162231+00:00', E'9a960582-c94e-427c-8782-fb9fa3dcc9c2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Brentwood', E'2023-08-11T11:51:46.495291+00:00', E'2023-08-11T11:51:46.495291+00:00', E'b5bad11a-fb37-4d1c-a710-63246ec40476');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Basildon', E'2023-08-11T11:51:49.882782+00:00', E'2023-08-11T11:51:49.882782+00:00', E'8b10043a-016b-4656-8d58-e8c462362072');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Castle Point', E'2023-08-11T11:51:53.680045+00:00', E'2023-08-11T11:51:53.680045+00:00', E'd9125211-eff4-472d-a87f-3cbc28efc8bf');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Colchester', E'2023-08-11T11:51:57.612036+00:00', E'2023-08-11T11:51:57.612036+00:00', E'2ecac7d5-e4f1-4a06-bf40-cb98fe7bab9a');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tendring', E'2023-08-11T11:52:01.150662+00:00', E'2023-08-11T11:52:01.150662+00:00', E'f263dd62-172c-4da0-89bf-bb2d3be5d7b2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Chelmsford', E'2023-08-11T11:52:04.66555+00:00', E'2023-08-11T11:52:04.66555+00:00', E'686c96b1-2010-46c2-8c5e-6c8d2fe5b5f5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Uttlesford', E'2023-08-11T11:52:08.068448+00:00', E'2023-08-11T11:52:08.068448+00:00', E'701a88fc-5892-4589-95bd-104b79faf624');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Dacorum', E'2023-08-11T11:52:55.443281+00:00', E'2023-08-11T11:52:55.443281+00:00', E'66bd1ae0-2d7c-4aba-bf3d-147e957fb36e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stevenage', E'2023-08-11T11:52:59.919953+00:00', E'2023-08-11T11:52:59.919953+00:00', E'5edaeeae-46a4-4463-a1c0-a0b8ef4c3c49');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Broxbourne', E'2023-08-11T11:53:14.061032+00:00', E'2023-08-11T11:53:14.061032+00:00', E'06191639-1de2-40eb-b9ec-df535bb1c2fc');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hertsmere', E'2023-08-11T11:53:19.08106+00:00', E'2023-08-11T11:53:19.08106+00:00', E'63ed9699-3f49-4f09-aed9-2d21a64d3547');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Welwyn Hatfield', E'2023-08-11T11:53:22.78859+00:00', E'2023-08-11T11:53:22.78859+00:00', E'3911959a-ffdc-4d16-8fc3-d3f1cb20d541');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Hertfordshire', E'2023-08-11T11:53:26.367912+00:00', E'2023-08-11T11:53:26.367912+00:00', E'b4d00321-e489-41b8-bdc8-3d4d56dcc41b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Hertfordshire', E'2023-08-11T11:53:31.262135+00:00', E'2023-08-11T11:53:31.262135+00:00', E'198df810-8871-4836-a4b8-4aea20011e6e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Watford', E'2023-08-11T11:53:34.992897+00:00', E'2023-08-11T11:53:34.992897+00:00', E'15cec64a-89da-4336-951d-33d0f68ea728');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Three Rivers', E'2023-08-11T11:53:39.562865+00:00', E'2023-08-11T11:53:39.562865+00:00', E'f4c197b3-4a05-402a-867d-a1cbebea9a01');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'St Albans', E'2023-08-11T11:53:43.824649+00:00', E'2023-08-11T11:53:43.824649+00:00', E'92116953-28be-47a8-abb8-96eae9657b0c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Luton', E'2023-08-11T11:53:47.259524+00:00', E'2023-08-11T11:53:47.259524+00:00', E'88bdc706-624f-4cb1-b750-5d0e0317aa45');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Norfolk', E'2023-08-11T11:53:50.440247+00:00', E'2023-08-11T11:53:50.440247+00:00', E'cf50e0b0-bd1e-47cc-b468-5287e4e7a7a3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Norwich', E'2023-08-11T11:53:53.754534+00:00', E'2023-08-11T11:53:53.754534+00:00', E'baa07139-a61b-42e1-986c-1437846257dd');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'King\'s Lynn and West Norfolk', E'2023-08-11T11:54:02.401984+00:00', E'2023-08-11T11:54:02.401984+00:00', E'6ed57d88-3dd7-4972-83a3-4dd3c3c06e0a');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Norfolk', E'2023-08-11T11:54:06.143613+00:00', E'2023-08-11T11:54:06.143613+00:00', E'bd463730-7e44-4d19-9190-40dc702efca3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Breckland', E'2023-08-11T11:54:09.923304+00:00', E'2023-08-11T11:54:09.923304+00:00', E'8c2e0c18-2384-47c8-a0b3-2751d69030c8');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Great Yarmouth', E'2023-08-11T11:54:17.211202+00:00', E'2023-08-11T11:54:17.211202+00:00', E'd6fb2dfe-4271-4fbb-a3af-4c8f1bf54d80');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Peterborough', E'2023-08-11T11:54:31.06751+00:00', E'2023-08-11T11:54:31.06751+00:00', E'13bdcf69-f536-47f0-b86c-0770f9f8c3a4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Southend-on-Sea', E'2023-08-11T11:54:36.680813+00:00', E'2023-08-11T11:54:36.680813+00:00', E'b5dcfc79-9f32-4821-a7f0-a6ff3ee6baf5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Mid Suffolk', E'2023-08-11T11:54:40.730732+00:00', E'2023-08-11T11:54:40.730732+00:00', E'3cbfa2c9-5033-422f-a715-f461f65ba9f0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Suffolk', E'2023-08-11T11:54:44.531312+00:00', E'2023-08-11T11:54:44.531312+00:00', E'a0662023-62c2-4b38-9e4a-72a46d0ff0d5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Suffolk', E'2023-08-11T11:54:48.23227+00:00', E'2023-08-11T11:54:48.23227+00:00', E'fac6c1db-e151-4974-aaa4-980d1e0c3fe1');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Babergh', E'2023-08-11T11:54:52.01204+00:00', E'2023-08-11T11:54:52.01204+00:00', E'6f30b809-4cf5-4399-9671-778854a4bf43');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Ipswich', E'2023-08-11T11:54:56.671871+00:00', E'2023-08-11T11:54:56.671871+00:00', E'28464c6e-29f4-431a-911a-2c003c375e14');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Thurrock', E'2023-08-11T11:55:00.728589+00:00', E'2023-08-11T11:55:00.728589+00:00', E'11e28efe-03f7-4b81-93c2-3e0bb66e1cad');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Barking and Dagenham', E'2023-08-11T11:55:05.111775+00:00', E'2023-08-11T11:55:05.111775+00:00', E'abca812e-28b3-4dda-b5de-85ced2fcae37');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Barnet', E'2023-08-11T11:55:08.453166+00:00', E'2023-08-11T11:55:08.453166+00:00', E'744e7461-68ae-4b02-b8fd-450041550023');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bexley', E'2023-08-11T11:55:12.056575+00:00', E'2023-08-11T11:55:12.056575+00:00', E'b220e94f-eee5-45ef-b3a7-ba4acc8d76b4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Brent', E'2023-08-11T11:55:15.678238+00:00', E'2023-08-11T11:55:15.678238+00:00', E'fc153749-65c9-422f-92cc-1e893236a058');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bromley', E'2023-08-11T11:55:19.478601+00:00', E'2023-08-11T11:55:19.478601+00:00', E'70986236-4bd9-4f58-8745-121dc944ef0e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Camden', E'2023-08-11T11:55:23.619491+00:00', E'2023-08-11T11:55:23.619491+00:00', E'2f3a8947-024a-4c12-bfe4-ad72d03c3ef8');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'City of London', E'2023-08-11T11:55:27.094981+00:00', E'2023-08-11T11:55:27.094981+00:00', E'763df229-c168-4086-8bd8-f40a486aa1a3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Croydon', E'2023-08-11T11:55:30.129121+00:00', E'2023-08-11T11:55:30.129121+00:00', E'1a967319-ce8c-49b0-8e5e-c772aefffb5c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Ealing', E'2023-08-11T11:55:33.778864+00:00', E'2023-08-11T11:55:33.778864+00:00', E'e6ba9325-0efd-476e-bd02-e4655aae5a50');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Enfield', E'2023-08-11T11:55:37.090466+00:00', E'2023-08-11T11:55:37.090466+00:00', E'7293ef50-4aec-4650-9691-adc9bbe82896');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Greenwich', E'2023-08-11T11:55:40.495432+00:00', E'2023-08-11T11:55:40.495432+00:00', E'8abe0c21-da29-4193-876f-5a92fcc502eb');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hackney', E'2023-08-11T11:55:44.490546+00:00', E'2023-08-11T11:55:44.490546+00:00', E'469b5282-98fc-48ff-b27d-b6d8fafa9f89');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hammersmith and Fulham', E'2023-08-11T11:55:51.88486+00:00', E'2023-08-11T11:55:51.88486+00:00', E'eb13cc60-6aba-41af-8b1c-d51e7e65ee3d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Haringey', E'2023-08-11T11:55:56.294725+00:00', E'2023-08-11T11:55:56.294725+00:00', E'34fcad1b-e5a7-47a5-8762-d50db5fa930d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Harrow', E'2023-08-11T11:55:59.821384+00:00', E'2023-08-11T11:55:59.821384+00:00', E'd96a1891-0a4c-42e2-b19a-efa8f840dd76');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Havering', E'2023-08-11T11:56:03.058817+00:00', E'2023-08-11T11:56:03.058817+00:00', E'ef0b9e83-b0fe-4efe-a0d6-df43ecdfc253');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hillingdon', E'2023-08-11T11:56:06.058234+00:00', E'2023-08-11T11:56:06.058234+00:00', E'27083e5f-9731-4a05-93f4-fa9f98737dec');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hounslow', E'2023-08-11T11:56:09.431242+00:00', E'2023-08-11T11:56:09.431242+00:00', E'39108ef5-6ae2-47a5-8696-9e5b5da3b630');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Islington', E'2023-08-11T11:56:13.780324+00:00', E'2023-08-11T11:56:13.780324+00:00', E'cedfd7c3-9f91-44f8-9f2e-b34876bab68f');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Kensington and Chelsea', E'2023-08-11T11:56:17.370243+00:00', E'2023-08-11T11:56:17.370243+00:00', E'92c14ea0-cb53-4411-9774-c377ad3d4519');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Kingston upon Thames', E'2023-08-11T11:56:21.413779+00:00', E'2023-08-11T11:56:21.413779+00:00', E'd3f2d1a1-9e04-402f-b3dd-f05d212ebd4d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Lambeth', E'2023-08-11T11:56:24.782546+00:00', E'2023-08-11T11:56:24.782546+00:00', E'401684c7-8029-48f5-8e2c-be2db42ee3b5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Lewisham', E'2023-08-11T11:56:53.051916+00:00', E'2023-08-11T11:56:53.051916+00:00', E'07981121-0bb2-4aac-925b-8cefd7b4f85f');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Merton', E'2023-08-11T11:57:01.219815+00:00', E'2023-08-11T11:57:01.219815+00:00', E'8fcd1a38-8754-4036-9ad0-3516405cc766');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Newham', E'2023-08-11T11:57:07.359144+00:00', E'2023-08-11T11:57:07.359144+00:00', E'7c31d3a3-8fb9-4f3d-a449-b7175852fbc2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Redbridge', E'2023-08-11T11:57:15.729722+00:00', E'2023-08-11T11:57:15.729722+00:00', E'1772ed34-a423-4aa4-9da0-b7c0ed4bab40');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Richmond upon Thames', E'2023-08-11T11:57:21.751025+00:00', E'2023-08-11T11:57:21.751025+00:00', E'9b5d9caa-39d6-4d8e-b612-34596ad93e7d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Southwark', E'2023-08-11T11:57:31.390907+00:00', E'2023-08-11T11:57:31.390907+00:00', E'83ebb05a-775a-4623-9f02-0677bf19ae93');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sutton', E'2023-08-11T11:57:35.127119+00:00', E'2023-08-11T11:57:35.127119+00:00', E'db8bb5a7-7c1b-4a6e-91f9-00d6d7a913bc');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tower Hamlets', E'2023-08-11T11:57:41.257466+00:00', E'2023-08-11T11:57:41.257466+00:00', E'87522594-f97d-47e9-a0b2-068577d8fdad');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Waltham Forest', E'2023-08-11T11:57:49.842748+00:00', E'2023-08-11T11:57:49.842748+00:00', E'227ba643-6112-4a11-9a6b-6596fe1c8598');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wandsworth', E'2023-08-11T11:57:52.970646+00:00', E'2023-08-11T11:57:52.970646+00:00', E'd42d9d76-d612-4670-ba7a-d269d876c559');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Westminster', E'2023-08-11T11:57:56.441323+00:00', E'2023-08-11T11:57:56.441323+00:00', E'339ebb28-a993-4576-9284-794952e218c6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'County Durham', E'2023-08-11T11:58:00.353186+00:00', E'2023-08-11T11:58:00.353186+00:00', E'8c835521-d131-4ccc-8426-90bca7d0f677');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Darlington', E'2023-08-11T11:58:03.293782+00:00', E'2023-08-11T11:58:03.293782+00:00', E'aa7ea65b-00d5-4055-939f-03b9590e7b22');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Gateshead', E'2023-08-11T11:58:06.277098+00:00', E'2023-08-11T11:58:06.277098+00:00', E'4f8cf330-8040-4aa0-bb34-0d5dffa42020');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hartlepool', E'2023-08-11T11:58:08.971377+00:00', E'2023-08-11T11:58:08.971377+00:00', E'2d19383b-0a0c-4050-b7e4-d268fd984099');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Middlesbrough', E'2023-08-11T11:58:19.575039+00:00', E'2023-08-11T11:58:19.575039+00:00', E'eb239e02-fdf3-43bf-885a-95433d30baf6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Newcastle upon Tyne', E'2023-08-11T11:58:23.565098+00:00', E'2023-08-11T11:58:23.565098+00:00', E'4739d596-7cf5-4301-be1c-934812e5a7f4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Tyneside', E'2023-08-11T11:58:27.104446+00:00', E'2023-08-11T11:58:27.104446+00:00', E'4d97dfc9-f121-4604-936f-935434276d79');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Northumberland', E'2023-08-11T11:58:30.40889+00:00', E'2023-08-11T11:58:30.40889+00:00', E'0505c88f-470a-49c3-8e34-ace542c989bb');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Redcar and Cleveland', E'2023-08-11T11:58:34.458063+00:00', E'2023-08-11T11:58:34.458063+00:00', E'4bf0a9e8-4252-4524-ab88-9610c24bfca9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Tyneside', E'2023-08-11T11:58:39.022321+00:00', E'2023-08-11T11:58:39.022321+00:00', E'027e1785-2e29-4023-af15-f7c6ab61473e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stockton-on-Tees', E'2023-08-11T11:58:45.138527+00:00', E'2023-08-11T11:58:45.138527+00:00', E'7c7574d8-0ac2-4cf8-95a6-1087761fe3b2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sunderland', E'2023-08-11T11:58:51.944073+00:00', E'2023-08-11T11:58:51.944073+00:00', E'0c52fa52-7c6a-46d9-ad38-1770c565c4eb');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Blackburn with Darwen', E'2023-08-11T11:58:55.348143+00:00', E'2023-08-11T11:58:55.348143+00:00', E'a443eeb8-cdc9-4350-8010-d432a0ce1216');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Blackpool', E'2023-08-11T11:59:00.17553+00:00', E'2023-08-11T11:59:00.17553+00:00', E'6aa87986-aa28-49df-9010-275565583b20');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bolton', E'2023-08-11T11:59:07.795625+00:00', E'2023-08-11T11:59:07.795625+00:00', E'7d3788aa-2692-42ca-a321-28bcf15e7582');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bury', E'2023-08-11T11:59:11.736799+00:00', E'2023-08-11T11:59:11.736799+00:00', E'7137387f-2d47-4192-badd-fb496701e758');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cheshire East', E'2023-08-11T11:59:15.539169+00:00', E'2023-08-11T11:59:15.539169+00:00', E'f39a76cb-a17d-4b2b-a373-23f88a4a94f1');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cheshire West and Chester', E'2023-08-11T11:59:19.405515+00:00', E'2023-08-11T11:59:19.405515+00:00', E'0ee65567-47a6-4e3e-8d56-fef70ff71449');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Barrow-in-Furness', E'2023-08-11T11:59:23.621226+00:00', E'2023-08-11T11:59:23.621226+00:00', E'4002e836-0c5e-4f93-bef3-d17ac8f31fbf');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Carlisle', E'2023-08-11T11:59:27.381439+00:00', E'2023-08-11T11:59:27.381439+00:00', E'a887fb87-cefd-4158-b373-31a6da39763c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Eden', E'2023-08-11T11:59:30.446113+00:00', E'2023-08-11T11:59:30.446113+00:00', E'563099b4-b0b1-4cd3-bac6-b83b4707c8d8');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Copeland', E'2023-08-11T11:59:33.574238+00:00', E'2023-08-11T11:59:33.574238+00:00', E'b1d8b436-4fca-45e0-b6c5-5abb4c6b7f05');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Allerdale', E'2023-08-11T11:59:37.062375+00:00', E'2023-08-11T11:59:37.062375+00:00', E'a443d76d-53e0-48da-a041-5997e483a024');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Lakeland', E'2023-08-11T11:59:41.082189+00:00', E'2023-08-11T11:59:41.082189+00:00', E'd126a5f6-38e6-4bec-819f-b252e91b4e84');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Halton', E'2023-08-11T11:59:48.385546+00:00', E'2023-08-11T11:59:48.385546+00:00', E'1e577b5f-0aa0-4353-b3dc-4e75d2afed94');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Knowsley', E'2023-08-11T11:59:54.970388+00:00', E'2023-08-11T11:59:54.970388+00:00', E'68174b41-3abe-42a9-98de-49a0e5c2791e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wyre', E'2023-08-11T11:59:59.13532+00:00', E'2023-08-11T11:59:59.13532+00:00', E'5eb33845-f2f3-4217-a6d3-d10b9ef5f791');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Fylde', E'2023-08-11T12:00:02.658975+00:00', E'2023-08-11T12:00:02.658975+00:00', E'fd1ea93d-a13b-416a-aafd-bd8a3bb1c7eb');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Ribble Valley', E'2023-08-11T12:00:05.803383+00:00', E'2023-08-11T12:00:05.803383+00:00', E'419e78af-5028-4fb1-88a1-9acd6656f37b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Lancaster', E'2023-08-11T12:00:09.193577+00:00', E'2023-08-11T12:00:09.193577+00:00', E'64399a78-5d23-49dd-8e58-4718547469ba');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Lancashire', E'2023-08-11T12:00:12.83408+00:00', E'2023-08-11T12:00:12.83408+00:00', E'bb5c4eac-d50e-4424-837a-fc64715ab165');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rossendale', E'2023-08-11T12:00:17.096544+00:00', E'2023-08-11T12:00:17.096544+00:00', E'3b93cf49-90b9-4177-a55c-ab5d0aff0530');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Ribble', E'2023-08-11T12:00:20.546968+00:00', E'2023-08-11T12:00:20.546968+00:00', E'35c2763b-1d19-44f6-9fc7-7a500a9eb3a4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Burnley', E'2023-08-11T12:00:23.623345+00:00', E'2023-08-11T12:00:23.623345+00:00', E'84347c61-d071-4bc5-bff7-ceb70aacdcc0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Pendle', E'2023-08-11T12:00:27.225872+00:00', E'2023-08-11T12:00:27.225872+00:00', E'e979b783-fd21-4d60-9d81-4e106c58ae79');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Preston', E'2023-08-11T12:00:30.059604+00:00', E'2023-08-11T12:00:30.059604+00:00', E'bf5827b1-d69c-4e26-9807-0f7b78c58e4e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Chorley', E'2023-08-11T12:00:32.982182+00:00', E'2023-08-11T12:00:32.982182+00:00', E'50b1ecea-6504-40b7-80de-b8af66d9a7ff');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hyndburn', E'2023-08-11T12:00:36.354078+00:00', E'2023-08-11T12:00:36.354078+00:00', E'389938cf-eccf-4c14-bc94-80b5e7b80ee3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Liverpool', E'2023-08-11T12:00:40.525257+00:00', E'2023-08-11T12:00:40.525257+00:00', E'b49c0ad9-c46a-41df-9b91-806202764fe4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Manchester', E'2023-08-11T12:00:44.036854+00:00', E'2023-08-11T12:00:44.036854+00:00', E'c4f77036-a7c6-4c0b-91c4-d3cf75d923a9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Oldham', E'2023-08-11T12:00:47.589665+00:00', E'2023-08-11T12:00:47.589665+00:00', E'bc1efc65-6497-4959-a106-2cb25672761f');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rochdale', E'2023-08-11T12:00:50.821624+00:00', E'2023-08-11T12:00:50.821624+00:00', E'b2fad1da-56b6-449f-aeb5-fd36aef1a728');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Salford', E'2023-08-11T12:00:54.424956+00:00', E'2023-08-11T12:00:54.424956+00:00', E'b606e806-fc68-4669-8ce1-dea74966281b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sefton', E'2023-08-11T12:00:57.793756+00:00', E'2023-08-11T12:00:57.793756+00:00', E'52eea8a8-b2c6-41d4-bdc0-4ea46409866e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'St. Helens', E'2023-08-11T12:01:01.260557+00:00', E'2023-08-11T12:01:01.260557+00:00', E'd9e10a76-93cc-4e4b-9320-19f8856a3b24');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stockport', E'2023-08-11T12:01:04.684907+00:00', E'2023-08-11T12:01:04.684907+00:00', E'fa17d50d-f5f8-4053-a685-aed690a54996');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tameside', E'2023-08-11T12:01:08.241654+00:00', E'2023-08-11T12:01:08.241654+00:00', E'39b30990-3493-49c5-bcf1-11e0606c02f5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Trafford', E'2023-08-11T12:01:11.717778+00:00', E'2023-08-11T12:01:11.717778+00:00', E'7e9eeab2-eb42-4646-ba3a-e8630e2076cf');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Warrington', E'2023-08-11T12:01:15.255191+00:00', E'2023-08-11T12:01:15.255191+00:00', E'e52d624f-6371-4081-aebc-82e45d011967');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wigan', E'2023-08-11T12:01:18.342205+00:00', E'2023-08-11T12:01:18.342205+00:00', E'df4a5f7b-07a3-4611-ab4a-5eacc83dcf05');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wirral', E'2023-08-11T12:01:22.715445+00:00', E'2023-08-11T12:01:22.715445+00:00', E'9c6eea84-1035-4fb2-98b6-9a6c110bcbf5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bracknell Forest', E'2023-08-11T12:01:26.508768+00:00', E'2023-08-11T12:01:26.508768+00:00', E'6d6540fb-ec69-41e9-9806-b517eddce2c1');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Brighton and Hove', E'2023-08-11T12:01:30.580822+00:00', E'2023-08-11T12:01:30.580822+00:00', E'59c353f3-3a96-436f-ab07-90598348ad10');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Buckinghamshire', E'2023-08-11T12:01:34.290815+00:00', E'2023-08-11T12:01:34.290815+00:00', E'97f62d55-e21e-427f-b87d-b52bb2d7b6b5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Eastbourne', E'2023-08-11T12:01:40.693405+00:00', E'2023-08-11T12:01:40.693405+00:00', E'26571076-c385-4baf-84c6-2315e4c5923e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rother', E'2023-08-11T12:01:58.422028+00:00', E'2023-08-11T12:01:58.422028+00:00', E'28669f76-8b17-4cb0-8e66-a3b7da9022fd');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hastings', E'2023-08-11T12:02:14.34444+00:00', E'2023-08-11T12:02:14.34444+00:00', E'b1cf9768-b589-4342-8a01-f64a91bfdea6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Lewes', E'2023-08-11T12:02:17.235773+00:00', E'2023-08-11T12:02:17.235773+00:00', E'7b982f3a-9e06-41b0-9ccc-675bd8216ebe');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wealden', E'2023-08-11T12:02:20.698166+00:00', E'2023-08-11T12:02:20.698166+00:00', E'0e6bd9b1-b304-448d-853e-938a207a7749');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Winchester', E'2023-08-11T12:02:24.211372+00:00', E'2023-08-11T12:02:24.211372+00:00', E'b216d7b6-6195-40e9-b75e-6320e7a4cdea');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rushmoor', E'2023-08-11T12:02:27.2814+00:00', E'2023-08-11T12:02:27.2814+00:00', E'9d8bb9f5-56cd-4232-808e-eeb2fa1cd1cf');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Test Valley', E'2023-08-11T12:02:30.828998+00:00', E'2023-08-11T12:02:30.828998+00:00', E'754c3c29-0847-4c6c-a047-99a163389dc6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hart', E'2023-08-11T12:02:34.20055+00:00', E'2023-08-11T12:02:34.20055+00:00', E'5a7c8916-a4ef-4470-9314-b4332d01174c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Basingstoke and Deane', E'2023-08-11T12:02:38.508906+00:00', E'2023-08-11T12:02:38.508906+00:00', E'c482d680-33f3-492c-aed8-448c8f7e0e46');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'New Forest', E'2023-08-11T12:02:44.736064+00:00', E'2023-08-11T12:02:44.736064+00:00', E'798b2635-3d24-4217-8f61-5165ed8a6975');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Eastleigh', E'2023-08-11T12:02:51.001479+00:00', E'2023-08-11T12:02:51.001479+00:00', E'1b6d980e-7480-42f9-bb04-89baf07a5146');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Gosport', E'2023-08-11T12:02:53.602579+00:00', E'2023-08-11T12:02:53.602579+00:00', E'fa475330-402b-4114-9781-daaadddabd14');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Hampshire', E'2023-08-11T12:02:56.769975+00:00', E'2023-08-11T12:02:56.769975+00:00', E'94b17a39-05e6-45b3-a11a-ae3986761632');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Fareham', E'2023-08-11T12:02:59.941767+00:00', E'2023-08-11T12:02:59.941767+00:00', E'c77bfeb1-644b-4f5b-ba7e-5d920bd86b80');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Havant', E'2023-08-11T12:03:04.161315+00:00', E'2023-08-11T12:03:04.161315+00:00', E'5552d555-a024-4635-8f81-98a6bee47268');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Isle of Wight', E'2023-08-11T12:03:07.25869+00:00', E'2023-08-11T12:03:07.25869+00:00', E'dc1531fd-71c8-4d1f-9746-962c11e304ca');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Dartford', E'2023-08-11T12:03:10.460888+00:00', E'2023-08-11T12:03:10.460888+00:00', E'fca5cb98-b3dc-42b6-8802-bc68adb92222');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tunbridge Wells', E'2023-08-11T12:03:13.738312+00:00', E'2023-08-11T12:03:13.738312+00:00', E'abf22b69-e63c-47fb-b458-11d1bff39212');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Thanet', E'2023-08-11T12:03:17.24326+00:00', E'2023-08-11T12:03:17.24326+00:00', E'032d102f-0c24-4f07-9763-a4bfe92cbf01');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sevenoaks', E'2023-08-11T12:03:20.420666+00:00', E'2023-08-11T12:03:20.420666+00:00', E'21fc0341-0bc1-4156-930c-e6f6bfce44f0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Canterbury', E'2023-08-11T12:03:24.215412+00:00', E'2023-08-11T12:03:24.215412+00:00', E'890be707-b791-4032-88f6-ac64e761c5ac');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Maidstone', E'2023-08-11T12:03:28.453806+00:00', E'2023-08-11T12:03:28.453806+00:00', E'75afca6b-55ca-484d-86cb-4c110aae6666');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Folkestone and Hythe', E'2023-08-11T12:03:34.759861+00:00', E'2023-08-11T12:03:34.759861+00:00', E'c3466205-10c4-4903-a99e-ef19cf045bc0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Swale', E'2023-08-11T12:03:38.034302+00:00', E'2023-08-11T12:03:38.034302+00:00', E'2eb8e296-871c-462b-a981-0831d458f0ff');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Ashford', E'2023-08-11T12:03:41.500823+00:00', E'2023-08-11T12:03:41.500823+00:00', E'04946da1-4621-4768-820a-e253ccc74d57');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Gravesham', E'2023-08-11T12:03:48.94758+00:00', E'2023-08-11T12:03:48.94758+00:00', E'f9e9c62f-575f-494f-8004-8ee6dbb3b3f7');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Dover', E'2023-08-11T12:03:52.096732+00:00', E'2023-08-11T12:03:52.096732+00:00', E'7075ea97-1577-4f7d-a107-1fe153897d5c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tonbridge and Malling', E'2023-08-11T12:03:56.536634+00:00', E'2023-08-11T12:03:56.536634+00:00', E'be46b707-5a1b-45a6-9c21-da6e8e661238');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Medway', E'2023-08-11T12:03:59.649775+00:00', E'2023-08-11T12:03:59.649775+00:00', E'0f3ac1b7-17c0-4db9-9696-c79013ac8d7c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Milton Keynes', E'2023-08-11T12:04:02.824663+00:00', E'2023-08-11T12:04:02.824663+00:00', E'3e6da44d-a518-45d3-9dc0-377e81cf1bf6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Oxfordshire', E'2023-08-11T12:04:06.797829+00:00', E'2023-08-11T12:04:06.797829+00:00', E'61c859ea-0175-4f80-ae67-78ea310599b3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Oxfordshire', E'2023-08-11T12:04:11.227809+00:00', E'2023-08-11T12:04:11.227809+00:00', E'50b342ed-2e5c-4e87-b809-e2b0759e93a3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cherwell', E'2023-08-11T12:04:14.782131+00:00', E'2023-08-11T12:04:14.782131+00:00', E'3305b0b2-7531-4f5b-9298-c75eb69913b0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Oxford', E'2023-08-11T12:04:18.059091+00:00', E'2023-08-11T12:04:18.059091+00:00', E'14044335-cd07-4551-baf8-0bf893bc49d6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Vale of White Horse', E'2023-08-11T12:04:21.619804+00:00', E'2023-08-11T12:04:21.619804+00:00', E'87517e8d-8ca3-46cb-aff7-c54841dbedc6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Portsmouth', E'2023-08-11T12:04:29.085186+00:00', E'2023-08-11T12:04:29.085186+00:00', E'47dc43c1-218a-46c0-8f22-25d28d7300dd');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Reading', E'2023-08-11T12:04:34.688661+00:00', E'2023-08-11T12:04:34.688661+00:00', E'02ab717e-f3a0-4b42-8a56-df52a27e1f15');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Slough', E'2023-08-11T12:04:38.151788+00:00', E'2023-08-11T12:04:38.151788+00:00', E'950e828a-6221-4373-baf5-b06eb05a5d56');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Southampton', E'2023-08-11T12:04:41.713348+00:00', E'2023-08-11T12:04:41.713348+00:00', E'0475066c-c23c-4ba0-9f8a-6367331f4b43');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Elmbridge', E'2023-08-11T12:04:48.545774+00:00', E'2023-08-11T12:04:48.545774+00:00', E'82818246-8b8f-44e0-9ae7-1b2e4f644033');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Epsom and Ewell', E'2023-08-11T12:04:52.377893+00:00', E'2023-08-11T12:04:52.377893+00:00', E'da0ee8ff-181c-460d-97a1-60dceef7d9fe');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Reigate and Banstead', E'2023-08-11T12:04:57.611328+00:00', E'2023-08-11T12:04:57.611328+00:00', E'cfdf97d5-6797-4088-a641-5ecbfa61e939');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Runnymede', E'2023-08-11T12:05:01.679179+00:00', E'2023-08-11T12:05:01.679179+00:00', E'74b337e3-41a2-45b2-bd04-d4dba5b65fca');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Mole Valley', E'2023-08-11T12:05:04.816142+00:00', E'2023-08-11T12:05:04.816142+00:00', E'd5552b6c-a0e4-4117-a87e-b0e1f3ef4cb0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Woking', E'2023-08-11T12:05:51.463876+00:00', E'2023-08-11T12:05:51.463876+00:00', E'd96b44aa-ce72-4206-9042-b7c6b7c2aacb');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Guildford', E'2023-08-11T12:05:55.933124+00:00', E'2023-08-11T12:05:55.933124+00:00', E'd4700dca-0dc9-4f9e-9081-abe36bdbe905');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tandridge', E'2023-08-11T12:06:00.581433+00:00', E'2023-08-11T12:06:00.581433+00:00', E'48e3add4-d0d8-4bfc-924e-4d5f4f9cd4e8');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Spelthorne', E'2023-08-11T12:06:03.558104+00:00', E'2023-08-11T12:06:03.558104+00:00', E'b764589c-7cc3-4e10-a464-b441ece47add');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Surrey Heath', E'2023-08-11T12:06:07.269079+00:00', E'2023-08-11T12:06:07.269079+00:00', E'8f42287c-54ab-4599-8af8-badc400ff1d9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Waverley', E'2023-08-11T12:06:10.675992+00:00', E'2023-08-11T12:06:10.675992+00:00', E'add73109-94d6-4166-ac43-793e799e92cd');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Berkshire', E'2023-08-11T12:06:14.298911+00:00', E'2023-08-11T12:06:14.298911+00:00', E'1188ab65-3062-4a3e-9e86-ba091deeb75d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Arun', E'2023-08-11T12:06:17.380023+00:00', E'2023-08-11T12:06:17.380023+00:00', E'4129d625-f60c-4d7b-8184-fd454436ef94');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Chichester', E'2023-08-11T12:06:20.638915+00:00', E'2023-08-11T12:06:20.638915+00:00', E'66ef714c-4073-44c6-bdd2-7c8e4aeb5379');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Crawley', E'2023-08-11T12:06:24.540637+00:00', E'2023-08-11T12:06:24.540637+00:00', E'44db78ac-c860-4c56-9114-a64f3e463f19');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Horsham', E'2023-08-11T12:06:30.448526+00:00', E'2023-08-11T12:06:30.448526+00:00', E'8048e336-ade3-49ed-afe2-8b8c54195cbf');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Worthing', E'2023-08-11T12:06:33.239273+00:00', E'2023-08-11T12:06:33.239273+00:00', E'45c31c99-f3bc-4a2a-ab38-60ddce5ea1d3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Adur', E'2023-08-11T12:06:36.148078+00:00', E'2023-08-11T12:06:36.148078+00:00', E'854b487e-c931-44ce-97ce-81677c77ebed');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Mid Sussex', E'2023-08-11T12:06:39.05913+00:00', E'2023-08-11T12:06:39.05913+00:00', E'efb87065-3219-428a-8061-f35d52023157');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Windsor and Maidenhead', E'2023-08-11T12:06:46.983905+00:00', E'2023-08-11T12:06:46.983905+00:00', E'124bf9f9-149c-4ace-93e6-9092cfb8ebee');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wokingham', E'2023-08-11T12:06:50.974021+00:00', E'2023-08-11T12:06:50.974021+00:00', E'813c33b8-ced1-4c61-9124-7a8bafad6ecd');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bath and North East Somerset', E'2023-08-11T12:06:55.28923+00:00', E'2023-08-11T12:06:55.28923+00:00', E'6983787a-f3fe-411f-ab9a-a094dac9a4d1');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bournemouth, Christchurch and Poole', E'2023-08-11T12:07:00.651481+00:00', E'2023-08-11T12:07:00.651481+00:00', E'18c0aa5d-8f05-44e4-a93d-78daa41b5ab2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bristol, City of', E'2023-08-11T12:07:05.52515+00:00', E'2023-08-11T12:07:05.52515+00:00', E'8d8448a9-8d5d-4641-8e68-d438b8c1acc7');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cornwall', E'2023-08-11T12:07:12.403377+00:00', E'2023-08-11T12:07:12.403377+00:00', E'7ceb963e-2389-431e-b1b8-5a25dfccbe40');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Exeter', E'2023-08-11T12:18:02.3205+00:00', E'2023-08-11T12:18:02.3205+00:00', E'4e4ed1ed-314b-401a-b2f6-811ec2528e66');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Devon', E'2023-08-11T12:18:09.083241+00:00', E'2023-08-11T12:18:09.083241+00:00', E'6431b64d-02d9-4abf-8c50-3ceb425bfd40');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Mid Devon', E'2023-08-11T12:18:12.635689+00:00', E'2023-08-11T12:18:12.635689+00:00', E'ae0c063a-d1b4-4a85-96db-03ade62902a2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Teignbridge', E'2023-08-11T12:18:16.423566+00:00', E'2023-08-11T12:18:16.423566+00:00', E'cc9d6347-d046-457c-8b3d-e8c7a40aa87c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Torridge', E'2023-08-11T12:18:22.56673+00:00', E'2023-08-11T12:18:22.56673+00:00', E'393ddd38-cc10-4482-9ac4-240226fc7dfc');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'West Devon', E'2023-08-11T12:18:25.486308+00:00', E'2023-08-11T12:18:25.486308+00:00', E'72609364-0eb8-49be-a075-f01194202a96');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Hams', E'2023-08-11T12:18:28.822072+00:00', E'2023-08-11T12:18:28.822072+00:00', E'b9cf0689-95aa-4baf-8ca3-69814f7672a3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Devon', E'2023-08-11T12:18:32.357932+00:00', E'2023-08-11T12:18:32.357932+00:00', E'73827d2d-a03d-4a9e-abab-35ca8b217fbe');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Dorset', E'2023-08-11T12:18:36.039077+00:00', E'2023-08-11T12:18:36.039077+00:00', E'b16cc39c-aac2-47ce-90f7-6f4cf0720cb9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stroud', E'2023-08-11T12:18:38.875257+00:00', E'2023-08-11T12:18:38.875257+00:00', E'3d9c4e0c-9aed-41da-9644-908d92502f58');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tewkesbury', E'2023-08-11T12:18:42.344041+00:00', E'2023-08-11T12:18:42.344041+00:00', E'192b29a6-900c-41d5-8622-b4dcc6dc1e9c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cheltenham', E'2023-08-11T12:18:45.809929+00:00', E'2023-08-11T12:18:45.809929+00:00', E'37d49889-a3af-43f4-a583-0ac6f2337ae9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Forest of Dean', E'2023-08-11T12:18:49.351209+00:00', E'2023-08-11T12:18:49.351209+00:00', E'325c97df-2e44-4f6e-8250-5efc466c1898');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Gloucester', E'2023-08-11T12:18:52.95981+00:00', E'2023-08-11T12:18:52.95981+00:00', E'72e567c4-f242-4726-9345-48f86c671236');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cotswold', E'2023-08-11T12:18:56.357504+00:00', E'2023-08-11T12:18:56.357504+00:00', E'6187efc6-6827-4b10-8bc7-48428685f4ea');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Isles of Scilly', E'2023-08-11T12:19:01.62694+00:00', E'2023-08-11T12:19:01.62694+00:00', E'ef34292d-07ad-4bb2-bf3d-87b13cee7c19');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Somerset', E'2023-08-11T12:19:09.562881+00:00', E'2023-08-11T12:19:09.562881+00:00', E'af810f25-2c7d-44f6-b32f-b883b1789b85');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Plymouth', E'2023-08-11T12:19:12.607953+00:00', E'2023-08-11T12:19:12.607953+00:00', E'a4207809-7cee-4419-b5ca-816f2afd28f9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Somerset West and Taunton', E'2023-08-11T12:19:16.312619+00:00', E'2023-08-11T12:19:16.312619+00:00', E'ee001dd3-21dc-4944-913f-2f39c7845149');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Somerset', E'2023-08-11T12:19:20.072182+00:00', E'2023-08-11T12:19:20.072182+00:00', E'c0d896a1-ec37-4564-98e1-8c7ed06d6c44');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sedgemoor', E'2023-08-11T12:19:25.905039+00:00', E'2023-08-11T12:19:25.905039+00:00', E'15a87b28-8f9c-4b8e-8860-8406312f8e32');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Mendip', E'2023-08-11T12:19:29.957122+00:00', E'2023-08-11T12:19:29.957122+00:00', E'a2050614-f181-45b0-83cd-f27f0e0eeef6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Gloucestershire', E'2023-08-11T12:19:33.919334+00:00', E'2023-08-11T12:19:33.919334+00:00', E'06a3496d-17ad-41f6-b6be-8e635b33de72');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Swindon', E'2023-08-11T12:19:37.164643+00:00', E'2023-08-11T12:19:37.164643+00:00', E'477d2b15-b7df-4821-a5de-46f547d864f3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wiltshire', E'2023-08-11T12:19:40.578469+00:00', E'2023-08-11T12:19:40.578469+00:00', E'80a73674-c141-4df3-86b6-2478edbc99cc');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Birmingham', E'2023-08-11T12:19:53.233329+00:00', E'2023-08-11T12:19:53.233329+00:00', E'd778691f-0998-4a0a-8487-ad5550da4ed8');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Coventry', E'2023-08-11T12:19:58.514922+00:00', E'2023-08-11T12:19:58.514922+00:00', E'9a5ba9d7-a7be-400f-8752-066eb7b7730e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Dudley', E'2023-08-11T12:20:01.766334+00:00', E'2023-08-11T12:20:01.766334+00:00', E'fbe58a9e-dfe8-456e-8e82-4e0bcc64eb7e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Herefordshire, County of', E'2023-08-11T12:20:05.991274+00:00', E'2023-08-11T12:20:05.991274+00:00', E'f2572d5b-61be-4e14-b938-ca17df41975c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sandwell', E'2023-08-11T12:20:10.851701+00:00', E'2023-08-11T12:20:10.851701+00:00', E'abf94d59-3ef5-4f71-9a91-a533fd7200b1');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Shropshire', E'2023-08-11T12:20:14.10805+00:00', E'2023-08-11T12:20:14.10805+00:00', E'5e9f7639-1b65-4fea-8538-c5196f45bc22');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Solihull', E'2023-08-11T12:20:17.435973+00:00', E'2023-08-11T12:20:17.435973+00:00', E'd3f36895-6f90-465a-af85-02c744128343');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Staffordshire', E'2023-08-11T12:20:22.511488+00:00', E'2023-08-11T12:20:22.511488+00:00', E'3e8b7a74-eb51-48a8-9e28-fad3b8b2c02b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Newcastle-under-Lyme', E'2023-08-11T12:20:25.653101+00:00', E'2023-08-11T12:20:25.653101+00:00', E'5166d139-eec3-41a8-b132-685d18d5633d');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Tamworth', E'2023-08-11T12:20:30.21852+00:00', E'2023-08-11T12:20:30.21852+00:00', E'1864fe8a-42d6-4ee0-a250-3c85caf0afe2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cannock Chase', E'2023-08-11T12:20:33.714199+00:00', E'2023-08-11T12:20:33.714199+00:00', E'cbc6518d-7aac-4726-a023-acf6258b2378');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'South Staffordshire', E'2023-08-11T12:20:37.4765+00:00', E'2023-08-11T12:20:37.4765+00:00', E'ea4d1247-667a-471b-b8fa-8bf7b4e6769e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Lichfield', E'2023-08-11T12:20:40.897128+00:00', E'2023-08-11T12:20:40.897128+00:00', E'ebf7ef37-7f0b-4897-9631-0e900f2b356e');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stafford', E'2023-08-11T12:20:44.616065+00:00', E'2023-08-11T12:20:44.616065+00:00', E'64656a95-b7e2-4dac-9179-30abdc3e3411');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Staffordshire Moorlands', E'2023-08-11T12:20:48.123177+00:00', E'2023-08-11T12:20:48.123177+00:00', E'789cffeb-b4d9-4689-86ec-b2ed3a67cb97');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stoke-on-Trent', E'2023-08-11T12:20:51.139616+00:00', E'2023-08-11T12:20:51.139616+00:00', E'15f5f56f-4bd2-47ec-ae5e-ac75e4858283');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Telford and Wrekin', E'2023-08-11T12:20:55.03753+00:00', E'2023-08-11T12:20:55.03753+00:00', E'ce4ff19f-c601-4d5d-b1f1-f44e6b7926bc');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Walsall', E'2023-08-11T12:20:58.865049+00:00', E'2023-08-11T12:20:58.865049+00:00', E'aa7d4255-ce94-423a-82ba-88ed4ebfa384');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Warwickshire', E'2023-08-11T12:21:02.332612+00:00', E'2023-08-11T12:21:02.332612+00:00', E'68f63770-1842-4628-b17f-ddf7c12963e9');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Warwick', E'2023-08-11T12:21:05.873574+00:00', E'2023-08-11T12:21:05.873574+00:00', E'59a87299-8191-450c-87e1-f598cf0833f4');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Stratford-on-Avon', E'2023-08-11T12:21:09.152791+00:00', E'2023-08-11T12:21:09.152791+00:00', E'477656e3-4bf9-4168-b119-890c90440eae');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rugby', E'2023-08-11T12:21:12.679005+00:00', E'2023-08-11T12:21:12.679005+00:00', E'0e038476-f1d4-4c22-ac99-e57b18c2ce2b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Nuneaton and Bedworth', E'2023-08-11T12:21:16.5541+00:00', E'2023-08-11T12:21:16.5541+00:00', E'597950c5-101d-4ec9-947f-12c3ef72a1ec');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wolverhampton', E'2023-08-11T12:21:23.777277+00:00', E'2023-08-11T12:21:23.777277+00:00', E'59179691-55f6-443f-84f7-15eadd1a0477');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Worcester', E'2023-08-11T12:21:27.260652+00:00', E'2023-08-11T12:21:27.260652+00:00', E'375d1547-691b-452e-a926-9fd7419dd22b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Malvern Hills', E'2023-08-11T12:21:31.026957+00:00', E'2023-08-11T12:21:31.026957+00:00', E'a64c4a5e-83e2-4079-b8d5-546071aad998');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wyre Forest', E'2023-08-11T12:21:34.313358+00:00', E'2023-08-11T12:21:34.313358+00:00', E'b5a52117-f9b7-463f-bd67-5c2ea097eaf3');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Redditch', E'2023-08-11T12:21:37.871655+00:00', E'2023-08-11T12:21:37.871655+00:00', E'e15d48b9-b9f7-4452-a61e-ba3e78f76477');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bromsgrove', E'2023-08-11T12:21:41.375008+00:00', E'2023-08-11T12:21:41.375008+00:00', E'3dd6bc05-5df1-4dfa-aab2-a9d924e74ff6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wychavon', E'2023-08-11T12:21:44.751803+00:00', E'2023-08-11T12:21:44.751803+00:00', E'ef71c3d2-9763-4f52-b2bc-0e73de6a1cd2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Barnsley', E'2023-08-11T12:21:48.337701+00:00', E'2023-08-11T12:21:48.337701+00:00', E'5db7c082-0ae4-4a1a-a634-d31360b46fc2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Bradford', E'2023-08-11T12:21:51.966571+00:00', E'2023-08-11T12:21:51.966571+00:00', E'6f9525ed-4104-4f14-8511-be1362622fa6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Calderdale', E'2023-08-11T12:21:55.276532+00:00', E'2023-08-11T12:21:55.276532+00:00', E'7e4c9194-ce7d-496f-85e7-d1cc1d710f41');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Doncaster', E'2023-08-11T12:21:59.502642+00:00', E'2023-08-11T12:21:59.502642+00:00', E'eb6c5def-6924-4694-81a0-1fb5003311df');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'East Riding of Yorkshire', E'2023-08-11T12:22:02.703525+00:00', E'2023-08-11T12:22:02.703525+00:00', E'87200a5e-0834-42b4-bbd0-7c330c9b4bd0');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Kingston upon Hull, City of', E'2023-08-11T12:22:09.751862+00:00', E'2023-08-11T12:22:09.751862+00:00', E'639d1ba4-0a5f-4b66-b224-32879d81cf70');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Kirklees', E'2023-08-11T12:22:13.591393+00:00', E'2023-08-11T12:22:13.591393+00:00', E'722d28e0-f3f1-4713-b641-b16c763735f2');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Leeds', E'2023-08-11T12:22:16.888083+00:00', E'2023-08-11T12:22:16.888083+00:00', E'ae96da88-029b-490f-ae2d-c94518b6aa80');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North East Lincolnshire', E'2023-08-11T12:22:20.24918+00:00', E'2023-08-11T12:22:20.24918+00:00', E'00ff15c2-a7a1-43d9-a5bf-40ff056ab8ba');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'North Lincolnshire', E'2023-08-11T12:22:23.744484+00:00', E'2023-08-11T12:22:23.744484+00:00', E'36f63403-a62e-4871-bd59-5644ffb4c6b6');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Richmondshire', E'2023-08-11T12:22:27.175052+00:00', E'2023-08-11T12:22:27.175052+00:00', E'e274f8ec-d532-490a-a389-8feff1e59b0b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Ryedale', E'2023-08-11T12:22:30.258634+00:00', E'2023-08-11T12:22:30.258634+00:00', E'd344c106-7a97-4400-b7cf-a4b222fa0a32');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Harrogate', E'2023-08-11T12:22:33.218653+00:00', E'2023-08-11T12:22:33.218653+00:00', E'da4bc366-6b63-45fa-a72c-c29eed649607');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Selby', E'2023-08-11T12:22:36.788881+00:00', E'2023-08-11T12:22:36.788881+00:00', E'd1d57c2f-ebe3-49ec-9c9e-0c572a3391e5');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Hambleton', E'2023-08-11T12:22:42.495726+00:00', E'2023-08-11T12:22:42.495726+00:00', E'b31eabf5-2f5c-46fd-8bae-762009398c59');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Craven', E'2023-08-11T12:22:46.079628+00:00', E'2023-08-11T12:22:46.079628+00:00', E'8016b73a-905b-4888-acde-52ca548fd1be');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Scarborough', E'2023-08-11T12:22:49.227268+00:00', E'2023-08-11T12:22:49.227268+00:00', E'7c66ce54-2d2e-41c2-a772-3d5466e57411');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rotherham', E'2023-08-11T12:22:52.78621+00:00', E'2023-08-11T12:22:52.78621+00:00', E'ece6c50a-0bf6-4040-8b6a-cd89cfeb321b');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Rotherham', E'2023-08-11T12:23:09.209919+00:00', E'2023-08-11T12:23:09.209919+00:00', E'10eb5b97-a889-47ac-be20-7c5929569c21');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Sheffield', E'2023-08-11T12:23:18.533156+00:00', E'2023-08-11T12:23:18.533156+00:00', E'e8cace39-739a-4011-acf1-a4596f8265be');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Wakefield', E'2023-08-11T12:23:22.029309+00:00', E'2023-08-11T12:23:22.029309+00:00', E'270c80bb-78a8-4309-ba43-12c657710a50');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Westmorland and furness', E'2023-08-11T12:23:28.203665+00:00', E'2023-08-11T12:23:28.203665+00:00', E'90739776-a1f5-4626-a2f5-40872c1d377c');

INSERT INTO "public"."country_region"("country", "name", "created_at", "updated_at", "id") VALUES (E'England', E'Cumberland', E'2023-08-11T12:23:34.013661+00:00', E'2023-08-11T12:23:34.013661+00:00', E'4c768417-c72d-4cc2-88ac-149589df3838');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Aberdeen City', E'e7d29d8d-f867-42d0-a6e0-ec0271da04d0', E'2023-08-11T12:35:17.453697+00:00', E'2023-08-11T12:35:17.453697+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Aberdeenshire', E'5df3bbfd-c1e5-465a-94fa-798da8b46ac5', E'2023-08-11T12:35:29.891841+00:00', E'2023-08-11T12:35:29.891841+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Angus', E'9cfd61fe-2197-4658-a0d5-53782e471036', E'2023-08-11T12:35:33.043239+00:00', E'2023-08-11T12:35:33.043239+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Argyll and Bute', E'5b16a96d-9929-46b1-8ea2-488446b9c690', E'2023-08-11T12:35:37.086959+00:00', E'2023-08-11T12:35:37.086959+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'City of Edinburgh', E'9ce16fa4-1e65-4770-b493-6b2d9249f7f6', E'2023-08-11T12:35:41.846973+00:00', E'2023-08-11T12:35:41.846973+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Clackmannanshire', E'7b474638-4dbf-4f7b-a33c-02e80a4f6b15', E'2023-08-11T12:35:45.592182+00:00', E'2023-08-11T12:35:45.592182+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Dumfries and Galloway', E'dc0129ed-9294-4755-9c92-a94da10a0bf8', E'2023-08-11T12:35:48.847218+00:00', E'2023-08-11T12:35:48.847218+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Dundee City', E'34587a62-883e-4869-9a4e-6886f2f9e23b', E'2023-08-11T12:35:52.561022+00:00', E'2023-08-11T12:35:52.561022+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'East Ayrshire', E'43fd2667-113a-4371-8249-6a5d51eeb6fd', E'2023-08-11T12:35:56.40567+00:00', E'2023-08-11T12:35:56.40567+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'East Dunbartonshire', E'1b411971-19e8-4a0b-8d3f-82772d52a508', E'2023-08-11T12:36:00.625758+00:00', E'2023-08-11T12:36:00.625758+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'East Lothian', E'77997e5b-79fb-4df6-a3d5-6b2523009b26', E'2023-08-11T12:36:05.6725+00:00', E'2023-08-11T12:36:05.6725+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'East Renfrewshire', E'e4d7bad1-d8f9-4867-9466-a515c7d98afe', E'2023-08-11T12:36:08.785554+00:00', E'2023-08-11T12:36:08.785554+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Falkirk', E'de1d2d5c-0a94-4f6b-93ea-a168b6c45c21', E'2023-08-11T12:36:12.05414+00:00', E'2023-08-11T12:36:12.05414+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Fife', E'02b8bb00-ca82-4879-a11a-435c6ef3542d', E'2023-08-11T12:36:16.549665+00:00', E'2023-08-11T12:36:16.549665+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Glasgow City', E'31a02c6f-642d-4f52-878c-162a0a5dcceb', E'2023-08-11T12:36:51.934826+00:00', E'2023-08-11T12:36:51.934826+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Highland', E'0f7ae6f6-abd8-4149-bb1d-a3070dab9ff0', E'2023-08-11T12:36:56.375164+00:00', E'2023-08-11T12:36:56.375164+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Inverclyde', E'93878cc3-4a61-4f5f-8e6d-e9f8a16ea85d', E'2023-08-11T12:36:59.781349+00:00', E'2023-08-11T12:36:59.781349+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Midlothian', E'0683c762-9b51-46fd-ad7c-83cb768d690b', E'2023-08-11T12:37:03.048987+00:00', E'2023-08-11T12:37:03.048987+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Moray', E'b47d3a43-1a82-480f-afee-cf4944ac3f02', E'2023-08-11T12:37:06.373083+00:00', E'2023-08-11T12:37:06.373083+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Na h-Eileanan Siar', E'f1077c29-4149-425b-9394-2e58705de55b', E'2023-08-11T12:37:09.498945+00:00', E'2023-08-11T12:37:09.498945+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'North Ayrshire', E'1f238bb2-c2ff-4e8e-a288-21cacd9ba02c', E'2023-08-11T12:37:13.133709+00:00', E'2023-08-11T12:37:13.133709+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'North Lanarkshire', E'8280a9ed-40af-47fc-bac0-c58c4924f227', E'2023-08-11T12:37:18.574743+00:00', E'2023-08-11T12:37:18.574743+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Orkney Islands', E'89254ec8-47e1-4c7d-9d6d-fea684943356', E'2023-08-11T12:37:22.234745+00:00', E'2023-08-11T12:37:22.234745+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Perth and Kinross', E'f4b2c0cb-ce46-49cd-aae6-54c12686d30f', E'2023-08-11T12:37:27.934345+00:00', E'2023-08-11T12:37:27.934345+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Renfrewshire', E'052ae579-7259-4930-8e40-8f832aabfa9a', E'2023-08-11T12:37:32.435087+00:00', E'2023-08-11T12:37:32.435087+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Scottish Borders', E'ae74f021-47b8-4601-bafa-b1b638a2ade0', E'2023-08-11T12:37:35.87082+00:00', E'2023-08-11T12:37:35.87082+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Shetland Islands', E'5b7d041d-c601-42fb-84c9-7c58033bf26e', E'2023-08-11T12:37:39.485425+00:00', E'2023-08-11T12:37:39.485425+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'South Ayrshire', E'fb21fbfc-df31-471f-a3f3-147abcf9ebcf', E'2023-08-11T12:37:43.082314+00:00', E'2023-08-11T12:37:43.082314+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'South Lanarkshire', E'e1c3539d-b17e-42f6-90da-0510e6615ccf', E'2023-08-11T12:37:47.17626+00:00', E'2023-08-11T12:37:47.17626+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Stirling', E'7beeba5b-3995-4cd3-b34b-9b9dd39094f7', E'2023-08-11T12:37:50.611194+00:00', E'2023-08-11T12:37:50.611194+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'West Dunbartonshire', E'005331f2-9274-4cf7-bf0c-0e929e01bbfc', E'2023-08-11T12:37:54.295093+00:00', E'2023-08-11T12:37:54.295093+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'West Lothian', E'e4be57db-d49b-4bba-9bd5-df6cfcc74446', E'2023-08-11T12:37:58.450483+00:00', E'2023-08-11T12:37:58.450483+00:00', E'Scotland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Blaenau Gwent', E'e38ccddd-5f90-4307-9404-c92ad9e2a8f9', E'2023-08-11T12:38:11.499805+00:00', E'2023-08-11T12:38:11.499805+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Bridgend', E'808a4d54-32b1-4a60-b9de-064c0833a511', E'2023-08-11T12:38:15.29131+00:00', E'2023-08-11T12:38:15.29131+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Caerphilly', E'60c3354f-0b83-400a-8bf3-14f55bcb0dfc', E'2023-08-11T12:38:18.64065+00:00', E'2023-08-11T12:38:18.64065+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Cardiff', E'764befe2-742b-474e-ade6-ae0ec6935e51', E'2023-08-11T12:38:22.176+00:00', E'2023-08-11T12:38:22.176+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Carmarthenshire', E'dbc8a146-745e-4d7b-8ab9-8533bc27f80c', E'2023-08-11T12:38:25.892444+00:00', E'2023-08-11T12:38:25.892444+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Ceredigion', E'ef7028a9-e690-45b6-965c-e44f122b640f', E'2023-08-11T12:38:28.960243+00:00', E'2023-08-11T12:38:28.960243+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Conwy', E'dcad360c-dc3a-472a-9a40-3ccc77d90276', E'2023-08-11T12:38:32.204426+00:00', E'2023-08-11T12:38:32.204426+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Denbighshire', E'5c18399b-a014-4a74-9017-ae13935d2ac6', E'2023-08-11T12:38:35.530851+00:00', E'2023-08-11T12:38:35.530851+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Flintshire', E'ad990acf-e4c9-4a66-99b5-1b546cf333cf', E'2023-08-11T12:38:38.702367+00:00', E'2023-08-11T12:38:38.702367+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Gwynedd', E'88c398ee-284b-4fa0-bd10-d573c6648969', E'2023-08-11T12:38:42.425976+00:00', E'2023-08-11T12:38:42.425976+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Isle of Anglesey', E'd535fb55-e4b4-4cef-b1ff-093155ab5da2', E'2023-08-11T12:38:46.522288+00:00', E'2023-08-11T12:38:46.522288+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Merthyr Tydfil', E'534458d1-9303-4dcb-aaf3-07ef68d024d0', E'2023-08-11T12:38:50.326306+00:00', E'2023-08-11T12:38:50.326306+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Monmouthshire', E'ec1262a0-5d14-4e33-820a-eaba878f93ed', E'2023-08-11T12:38:53.670841+00:00', E'2023-08-11T12:38:53.670841+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Neath Port Talbot', E'7c02f8be-890f-42d9-a856-df134bf838f2', E'2023-08-11T12:38:57.480853+00:00', E'2023-08-11T12:38:57.480853+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Newport', E'e866b111-63b3-403b-8b92-de1e6812b24d', E'2023-08-11T12:39:00.725123+00:00', E'2023-08-11T12:39:00.725123+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Pembrokeshire', E'6df5c2b0-960c-45a6-b0f1-6a4b9a31f4eb', E'2023-08-11T12:39:04.610522+00:00', E'2023-08-11T12:39:04.610522+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Powys', E'bc830fa0-32fa-47fb-b09d-11406469e521', E'2023-08-11T12:39:12.598901+00:00', E'2023-08-11T12:39:12.598901+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Rhondda Cynon Taf', E'497b85ff-cc60-48f9-af8a-79d6cdf4564a', E'2023-08-11T12:39:17.343385+00:00', E'2023-08-11T12:39:17.343385+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Swansea', E'2df61454-39a3-46ae-9a09-fda2769ed210', E'2023-08-11T12:39:21.103072+00:00', E'2023-08-11T12:39:21.103072+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Torfaen', E'd6739675-50a3-443a-a29a-2cd89ae4bc74', E'2023-08-11T12:39:24.348407+00:00', E'2023-08-11T12:39:24.348407+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Vale of Glamorgan', E'800eb0fc-9934-4aa8-a050-6ab52f3164cd', E'2023-08-11T12:39:28.510776+00:00', E'2023-08-11T12:39:28.510776+00:00', E'Wales');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Wrexham', E'927a3f95-93d1-4a0b-af4f-c10974f1cdcb', E'2023-08-11T12:39:33.042967+00:00', E'2023-08-11T12:39:33.042967+00:00', E'Wales');

INSERT INTO "public"."country"("name") VALUES (E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Antrim and Newtownabbey', E'6263aa3c-c201-491a-b131-687e0063db9a', E'2023-08-11T12:45:31.165906+00:00', E'2023-08-11T12:45:31.165906+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Ards and North Down', E'802c3b0c-5aae-4d22-9d6d-6a7d6384cb1b', E'2023-08-11T12:45:36.364472+00:00', E'2023-08-11T12:45:36.364472+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Armagh City, Banbridge and Craigavon', E'1a79e58c-923b-4877-9586-0ea4dd0e19ef', E'2023-08-11T12:45:41.12629+00:00', E'2023-08-11T12:45:41.12629+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Belfast', E'69bae771-6f66-4787-9994-a23367f7be3d', E'2023-08-11T12:45:44.998287+00:00', E'2023-08-11T12:45:44.998287+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Causeway Coast and Glens', E'c1c88834-b064-4bc6-a07a-646a093201d8', E'2023-08-11T12:45:48.222673+00:00', E'2023-08-11T12:45:48.222673+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Derry City and Strabane', E'4b021bf8-148e-42c3-b9b3-05be492367c7', E'2023-08-11T12:45:51.685237+00:00', E'2023-08-11T12:45:51.685237+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Fermanagh and Omagh', E'a9f848b2-550a-45e2-b821-d8bc8bf8e229', E'2023-08-11T12:45:56.039992+00:00', E'2023-08-11T12:45:56.039992+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Lisburn and Castlereagh', E'78cc0d43-f873-4f73-96bf-388e32a3ba00', E'2023-08-11T12:45:59.37132+00:00', E'2023-08-11T12:45:59.37132+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Mid and East Antrim', E'007d72a4-4f33-41a6-a19a-25f102ff83cc', E'2023-08-11T12:46:02.724077+00:00', E'2023-08-11T12:46:02.724077+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Mid Ulster', E'cbb4a040-8b69-4a8d-9138-075262b1b234', E'2023-08-11T12:46:06.045821+00:00', E'2023-08-11T12:46:06.045821+00:00', E'Northern Ireland');

INSERT INTO "public"."country_region"("name", "id", "created_at", "updated_at", "country") VALUES (E'Newry, Mourne and Down', E'57ce7f06-0e9c-4942-9ec4-75b26d8d06c6', E'2023-08-11T12:46:11.794584+00:00', E'2023-08-11T12:46:11.794584+00:00', E'Northern Ireland');
