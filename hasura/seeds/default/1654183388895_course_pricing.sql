INSERT INTO course_pricing (
  type,
  level,
  blended,
  reaccreditation,
  price_amount,
  xero_code,
  price_currency
) VALUES
('OPEN', 'LEVEL_1', false, false, 130, 'LEVEL1.OP', 'GBP'),
('OPEN', 'LEVEL_2', false, false, 230, 'LEVEL2.OP', 'GBP'),
('OPEN', 'LEVEL_2', false, true, 230, 'LEVEL2.OP', 'GBP'),
('OPEN', 'INTERMEDIATE_TRAINER', false, false, 1600, 'INT.OP', 'GBP'),
('OPEN', 'INTERMEDIATE_TRAINER', false, true, 600, 'INT.RE.OP', 'GBP'),
('OPEN', 'FOUNDATION_TRAINER_PLUS', false, false, 1295, 'FTP.OP', 'GBP'),
('OPEN', 'FOUNDATION_TRAINER_PLUS', false, true, 600, 'FTP.RE.OP', 'GBP'),
('CLOSED', 'FOUNDATION_TRAINER_PLUS', false, false, 1295, 'FTP.CL', 'GBP'),
('CLOSED', 'FOUNDATION_TRAINER_PLUS', false, true, 600, 'FTP.RE.CL', 'GBP'),
('OPEN', 'ADVANCED_TRAINER', false, false, 1570, 'INT.RE.OP', 'GBP'),
('OPEN', 'ADVANCED_TRAINER', false, true, 710, 'INT.RE.OP', 'GBP'),
('CLOSED', 'LEVEL_1', true, false, 101, 'LEVEL1.CL', 'GBP'), -- 9
('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL', 'GBP'), -- 10
('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL', 'GBP'), -- 11
-- ('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL'), -- 12 (MIXED. same as 10)
-- ('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL'), -- 13 (MIXED. same as 11)
-- ('CLOSED', 'LEVEL_1', true, false, 101, 'LEVEL1.CL'), -- 14 (VIRTUAL. same as 9)
-- ('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL'), -- 15 (VIRTUAL. same as 10)
-- ('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL'), -- 16 (VIRTUAL. same as 11)
('CLOSED', 'LEVEL_2', true, false, 171, 'LEVEL2.CL', 'GBP'), -- 17
('CLOSED', 'LEVEL_2', true, true, 101, 'LEVEL2.RE.CL', 'GBP'), -- 18
('CLOSED', 'LEVEL_2', false, false, 171, 'LEVEL2.CL', 'GBP'), -- 19
('CLOSED', 'LEVEL_2', false, true, 101, 'LEVEL2.RE.CL', 'GBP'), -- 20
-- ('CLOSED', 'LEVEL_2', false, false, 171, 'LEVEL2.CL'), -- 21 (MIXED. same as 19)
-- ('CLOSED', 'LEVEL_2', false, true, 101, 'LEVEL2.RE.CL'), -- 22 (MIXED. same as 20)
('CLOSED', 'ADVANCED', false, false, 151, 'ADVMOD.CL', 'GBP'), -- 23

('CLOSED', 'INTERMEDIATE_TRAINER', false, false, 1290, 'INT.CL', 'GBP'), -- 24
('CLOSED', 'INTERMEDIATE_TRAINER', false, true, 540, 'INT.RE.CL', 'GBP'), -- 25
('CLOSED', 'ADVANCED_TRAINER', false, false, 1250, 'ADV.CL', 'GBP'), -- 26
('CLOSED', 'ADVANCED_TRAINER', false, true, 650, 'ADV.RE.CL', 'GBP'), -- 27
('CLOSED', 'LEVEL_1_BS', false, false, 101, 'LEVEL1.BS.CL', 'GBP'), -- 28
('CLOSED', 'LEVEL_1_BS', true, false, 101, 'LEVEL1.BS.CL', 'GBP'), -- 29
('CLOSED', 'LEVEL_1_BS', false, true, 101, 'LEVEL1.BS.RE.CL', 'GBP'), -- 30
('CLOSED', 'LEVEL_1_BS', true, true, 101, 'LEVEL1.BS.RE.CL', 'GBP'), -- 31
('OPEN', 'LEVEL_1', false, false, 130, 'LEVEL1.OP', 'AUD'),
('OPEN', 'LEVEL_2', false, false, 230, 'LEVEL2.OP', 'AUD'),
('OPEN', 'LEVEL_2', false, true, 230, 'LEVEL2.OP', 'AUD'),
('OPEN', 'INTERMEDIATE_TRAINER', false, false, 1600, 'INT.OP', 'AUD'),
('OPEN', 'INTERMEDIATE_TRAINER', false, true, 600, 'INT.RE.OP', 'AUD'),
('OPEN', 'FOUNDATION_TRAINER_PLUS', false, false, 1295, 'FTP.OP', 'AUD'),
('OPEN', 'FOUNDATION_TRAINER_PLUS', false, true, 600, 'FTP.RE.OP', 'AUD'),
('OPEN', 'ADVANCED_TRAINER', false, false, 1570, 'INT.RE.OP', 'AUD'),
('OPEN', 'ADVANCED_TRAINER', false, true, 710, 'INT.RE.OP', 'AUD'),
('CLOSED', 'LEVEL_1', true, false, 101, 'LEVEL1.CL', 'AUD'), -- 9
('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL', 'AUD'), -- 10
('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL', 'AUD'), -- 11
('CLOSED', 'LEVEL_2', true, false, 171, 'LEVEL2.CL', 'AUD'), -- 17
('CLOSED', 'LEVEL_2', true, true, 101, 'LEVEL2.RE.CL', 'AUD'), -- 18
('CLOSED', 'LEVEL_2', false, false, 171, 'LEVEL2.CL', 'AUD'), -- 19
('CLOSED', 'LEVEL_2', false, true, 101, 'LEVEL2.RE.CL', 'AUD'), -- 20
('CLOSED', 'ADVANCED', false, false, 151, 'ADVMOD.CL', 'AUD'), -- 23
('CLOSED', 'INTERMEDIATE_TRAINER', false, false, 1290, 'INT.CL', 'AUD'), -- 24
('CLOSED', 'INTERMEDIATE_TRAINER', false, true, 540, 'INT.RE.CL', 'AUD'), -- 25
('CLOSED', 'ADVANCED_TRAINER', false, false, 1250, 'ADV.CL', 'AUD'), -- 26
('CLOSED', 'ADVANCED_TRAINER', false, true, 650, 'ADV.RE.CL', 'AUD'), -- 27
('CLOSED', 'LEVEL_1_BS', false, false, 101, 'LEVEL1.BS.CL', 'AUD'), -- 28
('CLOSED', 'LEVEL_1_BS', true, false, 101, 'LEVEL1.BS.CL', 'AUD'), -- 29
('CLOSED', 'LEVEL_1_BS', false, true, 101, 'LEVEL1.BS.RE.CL', 'AUD'), -- 30
('CLOSED', 'LEVEL_1_BS', true, true, 101, 'LEVEL1.BS.RE.CL', 'AUD'),
('CLOSED', 'FOUNDATION_TRAINER_PLUS', false, false, 1295, 'FTP.CL', 'AUD'),
('CLOSED', 'FOUNDATION_TRAINER_PLUS', false, true, 600, 'FTP.RE.CL', 'AUD'); -- 31
