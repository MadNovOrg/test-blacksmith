DELETE FROM "public"."course_pricing_schedule" WHERE "course_pricing_id" = 'a46811ed-aa8e-48b8-9f35-0a864b4eecf7';

DELETE FROM "public"."course_pricing" WHERE "id" = 'a46811ed-aa8e-48b8-9f35-0a864b4eecf7';

INSERT INTO "public"."course_pricing"("blended", "reaccreditation", "level", "price_currency", "type", "xero_code", "created_at", "updated_at", "id", "price_amount") VALUES (false, false, E'THREE_DAY_SAFETY_RESPONSE_TRAINER', E'GBP', E'OPEN', E'SRT.OP', E'2023-12-26T10:39:31.764301+00:00', E'2023-12-26T10:39:31.764301+00:00', E'0de0da1f-d47e-4b4b-945f-3243c11f94c4', 1295);

INSERT INTO "public"."course_pricing"("blended", "reaccreditation", "level", "price_currency", "type", "xero_code", "created_at", "updated_at", "id", "price_amount") VALUES (false, true, E'THREE_DAY_SAFETY_RESPONSE_TRAINER', E'GBP', E'OPEN', E'SRT.RE.OP', E'2023-12-26T10:39:44.776115+00:00', E'2023-12-26T10:39:44.776115+00:00', E'35c4cc6d-a545-45e1-aee4-3f963c7964fe', 600);

INSERT INTO "public"."course_pricing_schedule"("effective_from", "effective_to", "price_currency", "created_at", "updated_at", "course_pricing_id", "id", "price_amount") VALUES (E'2023-01-01', E'2024-12-31', E'GBP', E'2023-12-26T10:40:34.309526+00:00', E'2023-12-26T10:40:34.309526+00:00', E'0de0da1f-d47e-4b4b-945f-3243c11f94c4', E'9f354545-c1be-4ea9-92d4-6562a5887ff8', 1295);

INSERT INTO "public"."course_pricing_schedule"("effective_from", "effective_to", "price_currency", "created_at", "updated_at", "course_pricing_id", "id", "price_amount") VALUES (E'2023-01-01', E'2024-12-31', E'GBP', E'2023-12-26T10:40:42.204507+00:00', E'2023-12-26T10:40:42.204507+00:00', E'35c4cc6d-a545-45e1-aee4-3f963c7964fe', E'13d84311-51fc-4965-a873-05729c545057', 600);
