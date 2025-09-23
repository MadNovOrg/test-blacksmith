alter table "public"."order" add column "order_due" float8 null;

UPDATE "public"."order" "_po" SET "order_due" = (
    SELECT
        CASE
            WHEN "p"."type" = 'PERCENT' THEN ("o"."order_total" * (100 - "p"."amount") / 100)
            WHEN "p"."type" = 'FREE_PLACES' THEN GREATEST(0, ("o"."order_total" * ("o"."quantity" - "p"."amount") / "o"."quantity"))
            ELSE "o"."order_total"
        END AS "order_due"
    FROM "public"."order" "o"
    LEFT JOIN "public"."promo_code" "p"
        ON "p"."code" IN (SELECT jsonb_array_elements_text("o"."promo_codes"))
    WHERE "o"."id" = "_po"."id"
);
