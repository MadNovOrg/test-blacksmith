CREATE TABLE "public"."certificate_expired_notification_jobs" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "course_certificate_id" uuid NOT NULL,
  "job_id" uuid NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("course_certificate_id") REFERENCES "public"."course_certificate"("id") ON UPDATE cascade ON DELETE cascade,
  UNIQUE ("course_certificate_id", "job_id")
);
