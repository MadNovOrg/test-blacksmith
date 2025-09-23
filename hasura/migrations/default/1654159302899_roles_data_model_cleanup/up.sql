ALTER TABLE "public"."organization" DROP CONSTRAINT "organization_status_fkey";
ALTER TABLE "public"."profile" DROP CONSTRAINT "profile_status_fkey";

ALTER TABLE "public"."organization" DROP COLUMN "status" CASCADE;
ALTER TABLE "public"."profile" DROP COLUMN "status" CASCADE;

DROP TABLE "public"."organization_member_role";
DROP TABLE "public"."organization_group";
DROP table "public"."organization_role";
DROP TABLE "public"."resource";
DROP TABLE "public"."profile_status";
DROP table "public"."organization_status";

