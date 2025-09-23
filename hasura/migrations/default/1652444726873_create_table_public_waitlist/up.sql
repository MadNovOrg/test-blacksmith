CREATE TABLE "public"."waitlist" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "course_id" integer NOT NULL,
  "given_name" text NOT NULL,
  "family_name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text NOT NULL,
  "org_name" text NOT NULL,
  "confirmed" boolean NOT NULL default 'False',
  PRIMARY KEY ("id"),
  FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON UPDATE restrict ON DELETE restrict
);

alter table "public"."waitlist" add constraint "waitlist_course_id_email_key" unique ("course_id", "email");
