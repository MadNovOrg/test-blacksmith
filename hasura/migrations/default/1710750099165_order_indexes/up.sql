
CREATE INDEX IF NOT EXISTS idx_key_booking_contact ON "public"."order" ((booking_contact->>'email'));

CREATE INDEX IF NOT EXISTS "course_id_pk" on
  "public"."course_order" using btree ("course_id");
