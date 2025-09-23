CREATE TABLE "public"."resource_packs_type" (
    "name" text NOT NULL,
    PRIMARY KEY ("name"),
    UNIQUE ("name")
);

INSERT INTO "public"."resource_packs_type" ("name") VALUES (E'DIGITAL_WORKBOOK');
INSERT INTO "public"."resource_packs_type" ("name") VALUES (E'PRINT_WORKBOOK');