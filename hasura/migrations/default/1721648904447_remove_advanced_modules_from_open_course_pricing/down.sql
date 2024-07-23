INSERT INTO course_pricing (
  type,
  level,
  blended,
  reaccreditation,
  price_amount,
  xero_code
) VALUES 
('OPEN', 'ADVANCED', false, false, 1730, ''),
('INDIRECT', 'LEVEL_1_BS', false, false, 0, ''),
('INDIRECT', 'LEVEL_1_BS', false, true, 0, '');

INSERT INTO course_pricing_schedule (course_pricing_id, effective_from, effective_to, price_amount, price_currency)
VALUES ((SELECT id FROM course_pricing WHERE type = 'OPEN' and level = 'ADVANCED'),  '2023-01-01', '2024-12-31',1730, 'GBP');