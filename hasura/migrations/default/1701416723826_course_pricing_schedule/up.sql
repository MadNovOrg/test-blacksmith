

alter table "public"."course_pricing_schedule" add column "created_at" timestamptz
 null default now();

alter table "public"."course_pricing_schedule" add column "updated_at" timestamptz
 null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_course_pricing_schedule_updated_at"
BEFORE UPDATE ON "public"."course_pricing_schedule"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_course_pricing_schedule_updated_at" ON "public"."course_pricing_schedule"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

INSERT INTO course_pricing_schedule (course_pricing_id, effective_from, effective_to, price_amount, price_currency)
SELECT
    id,
    '2023-01-01',
    '2024-12-31',
    price_amount,
    price_currency
FROM
    course_pricing;

alter table "public"."course_pricing_changelog" add column "course_pricing_schedule_id" uuid
 null;

alter table "public"."course_pricing_changelog"
  add constraint "course_pricing_changelog_course_pricing_schedule_id_fkey"
  foreign key ("course_pricing_schedule_id")
  references "public"."course_pricing_schedule"
  ("id") on update restrict on delete restrict;

alter table "public"."course_pricing_changelog" drop constraint "course_pricing_changelog_course_pricing_schedule_id_fkey",
  add constraint "course_pricing_changelog_course_pricing_schedule_id_fkey"
  foreign key ("course_pricing_schedule_id")
  references "public"."course_pricing_schedule"
  ("id") on update restrict on delete set null;
