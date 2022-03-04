alter table "public"."module_group" drop constraint "module_group_color_fkey";

ALTER TABLE "public"."module_group" drop column "color";

DROP TABLE "public"."color";
