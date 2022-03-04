CREATE TABLE "public"."color" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."color"("name") VALUES (E'navy');
INSERT INTO "public"."color"("name") VALUES (E'lime');
INSERT INTO "public"."color"("name") VALUES (E'teal');
INSERT INTO "public"."color"("name") VALUES (E'yellow');
INSERT INTO "public"."color"("name") VALUES (E'purple');
INSERT INTO "public"."color"("name") VALUES (E'fuschia');
INSERT INTO "public"."color"("name") VALUES (E'grey');

ALTER TABLE "public"."module_group" ADD COLUMN "color" TEXT
    NOT NULL DEFAULT 'navy';
ALTER TABLE "public"."module_group" ALTER COLUMN "color" DROP DEFAULT;

alter table "public"."module_group"
    add constraint "module_group_color_fkey"
        foreign key ("color")
            references "public"."color"
                ("name") on update restrict on delete restrict;

UPDATE "public"."module_group" SET "color" = 'purple' WHERE name = 'Two Person Escorts and Seated Holds';
UPDATE "public"."module_group" SET "color" = 'fuschia' WHERE course_level = 'ADVANCED';