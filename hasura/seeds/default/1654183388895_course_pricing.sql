INSERT INTO course_pricing (
  type,
  level,
  blended,
  reaccreditation,
  price_amount,
  xero_code
) VALUES
('OPEN', 'LEVEL_1', false, false, 130, 'LEVEL1.OP'),
('OPEN', 'LEVEL_2', false, false, 230, 'LEVEL2.OP'),
('OPEN', 'LEVEL_2', false, true, 230, 'LEVEL2.OP'),
('OPEN', 'INTERMEDIATE_TRAINER', false, false, 1600, 'INT.OP'),
('OPEN', 'INTERMEDIATE_TRAINER', false, true, 600, 'INT.RE.OP'),
('OPEN', 'ADVANCED_TRAINER', false, false, 1570, 'INT.RE.OP'),
('OPEN', 'ADVANCED_TRAINER', false, true, 710, 'INT.RE.OP'),
('OPEN', 'ADVANCED', false, false, 1730, ''),
('CLOSED', 'LEVEL_1', true, false, 101, 'LEVEL1.CL'), -- 9
('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL'), -- 10
('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL'), -- 11
-- ('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL'), -- 12 (MIXED. same as 10)
-- ('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL'), -- 13 (MIXED. same as 11)
-- ('CLOSED', 'LEVEL_1', true, false, 101, 'LEVEL1.CL'), -- 14 (VIRTUAL. same as 9)
-- ('CLOSED', 'LEVEL_1', false, false, 101, 'LEVEL1.CL'), -- 15 (VIRTUAL. same as 10)
-- ('CLOSED', 'LEVEL_1', false, true, 101, 'LEVEL1.RE.CL'), -- 16 (VIRTUAL. same as 11)
('CLOSED', 'LEVEL_2', true, false, 171, 'LEVEL2.CL'), -- 17
('CLOSED', 'LEVEL_2', true, true, 101, 'LEVEL2.RE.CL'), -- 18
('CLOSED', 'LEVEL_2', false, false, 171, 'LEVEL2.CL'), -- 19
('CLOSED', 'LEVEL_2', false, true, 101, 'LEVEL2.RE.CL'), -- 20
-- ('CLOSED', 'LEVEL_2', false, false, 171, 'LEVEL2.CL'), -- 21 (MIXED. same as 19)
-- ('CLOSED', 'LEVEL_2', false, true, 101, 'LEVEL2.RE.CL'), -- 22 (MIXED. same as 20)
('CLOSED', 'ADVANCED', false, false, 151, 'ADVMOD.CL'), -- 23
('CLOSED', 'INTERMEDIATE_TRAINER', false, false, 1290, 'INT.CL'), -- 24
('CLOSED', 'INTERMEDIATE_TRAINER', false, true, 540, 'INT.RE.CL'), -- 25
('CLOSED', 'ADVANCED_TRAINER', false, false, 1250, 'ADV.CL'), -- 26
('CLOSED', 'ADVANCED_TRAINER', false, true, 650, 'ADV.RE.CL'); -- 27
