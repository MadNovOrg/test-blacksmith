CREATE TABLE "public"."certificate_expiry_notification_timeframe" (
  "name" text NOT NULL,
  PRIMARY KEY ("name"),
  UNIQUE ("name")
);
COMMENT ON TABLE "public"."certificate_expiry_notification_timeframe" IS E'Timeframe of the notification sent to the user about an expiring certificate';

INSERT INTO "public"."certificate_expiry_notification_timeframe"("name")
VALUES ('ONE_MONTH'),
  ('THREE_MONTHS'),
  ('SIX_MONTHS'),
  ('TWELVE_MONTHS');