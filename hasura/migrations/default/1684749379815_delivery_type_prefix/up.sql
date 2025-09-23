CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."course_delivery_type_prefix" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "prefix" text NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("name"),
    UNIQUE ("prefix")
);

COMMENT ON TABLE "public"."course_delivery_type_prefix" IS E'Course delivery types with their prefixes (used to generate course codes)';

INSERT INTO course_delivery_type_prefix (name, prefix) VALUES
('F2F', 'F'),
('VIRTUAL', 'V'),
('MIXED', 'VF');

alter table "public"."course_delivery_type_prefix"
  add constraint "course_delivery_type_prefix_name_fkey"
  foreign key ("name")
  references "public"."course_delivery_type"
  ("name") on update cascade on delete cascade;
