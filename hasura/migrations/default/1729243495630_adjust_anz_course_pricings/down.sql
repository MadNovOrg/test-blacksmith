DELETE FROM course_pricing
WHERE price_currency = 'AUD' AND ("type" = 'CLOSED' OR ("type" = 'OPEN' AND level IN ('INTERMEDIATE_TRAINER','FOUNDATION_TRAINER_PLUS')));