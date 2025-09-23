
CREATE TABLE "public"."resource_packs_delivery_type" ("name" text NOT NULL, PRIMARY KEY ("name") , UNIQUE ("name"));

INSERT INTO "public"."resource_packs_delivery_type"("name") VALUES (E'STANDARD');

INSERT INTO "public"."resource_packs_delivery_type"("name") VALUES (E'EXPRESS');

ALTER TABLE public.course 
ADD COLUMN resource_packs_delivery_type TEXT NULL;

ALTER TABLE public.course
ADD CONSTRAINT course_resource_packs_delivery_type_fkey
FOREIGN KEY (resource_packs_delivery_type)
REFERENCES public.resource_packs_delivery_type (name)
ON UPDATE CASCADE
ON DELETE RESTRICT;
