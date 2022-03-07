
alter table "public"."course_invites" ALTER COLUMN "id" DROP DEFAULT;
CREATE SEQUENCE course_invites_id_seq;
alter table "public"."course_invites" ALTER COLUMN "id" TYPE integer USING(nextval('course_invites_id_seq'));
alter table "public"."course_invites" ALTER COLUMN "id" SET NOT NULL;
alter table "public"."course_invites" ALTER COLUMN "id" SET DEFAULT nextval('course_invites_id_seq');
