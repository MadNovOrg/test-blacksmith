ALTER TABLE "public"."course" 
ADD COLUMN "resource_packs_type" TEXT NULL;

ALTER TABLE "public"."course"
ADD CONSTRAINT "course_resource_packs_type_fkey"
FOREIGN KEY ("resource_packs_type")
REFERENCES "public"."resource_packs_type"("name")
ON UPDATE CASCADE
ON DELETE RESTRICT;

