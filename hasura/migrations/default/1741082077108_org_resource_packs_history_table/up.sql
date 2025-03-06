CREATE TABLE "public"."resource_packs_events" (
    "name" text NOT NULL,
    PRIMARY KEY ("name"),
    UNIQUE ("name")
);

INSERT INTO "public"."resource_packs_events" ("name") VALUES (E'RESOURCE_PACKS_ADDED');
INSERT INTO "public"."resource_packs_events" ("name") VALUES (E'RESOURCE_PACKS_REMOVED');

CREATE TABLE "public"."org_resource_packs_history" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "org_id" uuid,
    "resource_packs_type" text NOT NULL,
    "event" text NOT NULL,
    "change" int4 NOT NULL,
    "total_balance" int4 NOT NULL,
    "reserved_balance" int4 NOT NULL,
    "payload" jsonb NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("org_id") REFERENCES "public"."organization" ("id") 
        ON UPDATE RESTRICT ON DELETE SET NULL,
    FOREIGN KEY ("resource_packs_type") REFERENCES "public"."resource_packs_type" ("name") 
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    FOREIGN KEY ("event") REFERENCES "public"."resource_packs_events" ("name") 
        ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

