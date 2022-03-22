alter table "public"."course_participant" add column "created_at" timestamptz
 null default now();

alter table "public"."course_participant" add column "updated_at" timestamptz
 null default now();

alter table "public"."course_participant_grading" add column "created_at" timestamptz
 null default now();

alter table "public"."course_participant_grading" add column "updated_at" timestamptz
 null default now();
