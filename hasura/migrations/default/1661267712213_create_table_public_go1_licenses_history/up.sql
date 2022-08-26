CREATE TABLE "public"."go1_licenses_history" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "org_id" uuid NOT NULL,
    "captured_at" timestamptz NOT NULL DEFAULT now(),
    "event" text NOT NULL,
    "balance" integer NOT NULL,
    "change" integer NOT NULL,
    "payload" jsonb,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("event") REFERENCES "public"."go1_history_events"("name") ON UPDATE restrict ON DELETE restrict
);

COMMENT ON TABLE "public"."go1_licenses_history" IS E'How organization\'s licenses number is changing in time';

CREATE EXTENSION IF NOT EXISTS pgcrypto;