alter table "public"."course_leader" rename to "course_trainer";

alter table "public"."course_trainer" add constraint "course_trainer_course_id_profile_id_key" unique ("course_id", "profile_id");

alter table "public"."course" drop constraint "course_trainer_profile_id_fkey";

alter table "public"."course" drop column "trainer_profile_id";

CREATE FUNCTION course_lead_trainer(course_row course)
RETURNS profile AS $$
    SELECT "profile".*
    FROM "public"."profile"
    WHERE "profile"."id" = (
      SELECT "profile_id"
      FROM "public"."course_trainer"
      WHERE "course_id" = course_row.id
      AND "course_trainer"."type" = 'LEADER'
    )
$$ LANGUAGE sql STABLE;

alter table "public"."profile_role" drop constraint "profile_role_role_id_fkey",
  add constraint "profile_role_role_id_fkey"
  foreign key ("role_id")
  references "public"."role"
  ("id") on update no action on delete cascade;
