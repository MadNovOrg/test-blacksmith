INSERT INTO "public"."course_promo_code" ("id", "course_id", "promo_id") VALUES
('3764f245-935a-4c12-b3b1-5b0c3ba41df9', '10004', '1e0d8506-0d49-4ed3-b0da-812cea3b49d1'),
('255bf304-ff42-476c-96f9-5a4454953d2a', '10003', '1e0d8506-0d49-4ed3-b0da-812cea3b49d1');

-- forcing directly to EVALUATION_MISSING is not working
-- is also not possible to set from insert because of the callback on the BE that will set the value to GRADE_MISSING
UPDATE public.course SET course_status = 'COMPLETED' WHERE (id = 10010);
UPDATE public.course SET course_status = 'EVALUATION_MISSING' WHERE (id = 10010);
