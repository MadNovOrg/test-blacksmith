


CREATE TABLE "public"."profile_temp" (
  "id" serial NOT NULL,
  "email" text NOT NULL,
  "given_name" text NOT NULL,
  "family_name" text NOT NULL,
  "phone" text,
  "dob" date,
  "accept_marketing" boolean NOT NULL,
  "accept_tcs" boolean NOT NULL,
  "sector" text,
  "job_title" text,
  "course_id" integer,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."profile_temp" IS E'Contains partial temporary profiles until account in cognito is confirmed';
