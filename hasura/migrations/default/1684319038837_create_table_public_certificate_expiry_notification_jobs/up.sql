CREATE TABLE "public"."certificate_expiry_notification_jobs" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "course_certificate_id" uuid NOT NULL,
  "job_id" uuid NOT NULL,
  "timeframe" text NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("course_certificate_id") REFERENCES "public"."course_certificate"("id") ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY ("timeframe") REFERENCES "public"."certificate_expiry_notification_timeframe"("name") ON UPDATE no action ON DELETE no action,
  UNIQUE ("course_certificate_id", "job_id", "timeframe")
);
COMMENT ON TABLE "public"."certificate_expiry_notification_jobs" IS E'Stores scheduled jobs ids for the certificate expiry notification';