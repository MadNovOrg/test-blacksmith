INSERT INTO course_pricing_schedule (course_pricing_id, effective_from, effective_to, price_amount, price_currency)
SELECT
    id,
    '2023-01-01',
    '2025-12-31',
    price_amount,
    price_currency
FROM
    course_pricing;