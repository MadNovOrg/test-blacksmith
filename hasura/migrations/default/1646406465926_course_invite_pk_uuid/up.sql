alter table "public"."course_invites" ALTER COLUMN "id" DROP DEFAULT;
alter table "public"."course_invites" ALTER COLUMN "id" TYPE uuid USING(gen_random_uuid());
alter table "public"."course_invites" ALTER COLUMN "id" SET NOT NULL;
alter table "public"."course_invites" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
DROP SEQUENCE IF EXISTS "public"."course_invites_id_seq";
