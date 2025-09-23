INSERT INTO course_pricing("type", "level","blended", "reaccreditation", "price_amount","price_currency", "xero_code") 
 VALUES 
        -- OPEN
        
        -- INTERMEDIATE TRAINER
        ('OPEN', 'INTERMEDIATE_TRAINER', false, false, 0, 'AUD', 'INT.OP'),
        ('OPEN', 'INTERMEDIATE_TRAINER', false, true, 0, 'AUD', 'INT.RE.OP'),
        
        -- FOUNDATION TRAINER PLUS
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', false, false, 0, 'AUD', 'FTP.OP'),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', false, true, 0, 'AUD', 'FTP.RE.OP'),
        
        -- CLOSED
        
        -- LEVEL ONE
        ('CLOSED', 'LEVEL_1', false, false, 0, 'AUD', 'LEVEL1.CL'),
        ('CLOSED', 'LEVEL_1', true, false, 0, 'AUD', 'LEVEL1.CL'),
        ('CLOSED', 'LEVEL_1', false, true, 0, 'AUD', 'LEVEL1.RE.CL'),
        ('CLOSED', 'LEVEL_1', true, true, 0, 'AUD', 'LEVEL1.RE.CL'),
        
        -- LEVEL ONE BEHAVIOUR SUPPORT
        ('CLOSED', 'LEVEL_1_BS', false, false, 0, 'AUD', 'LEVEL1.BS.CL'),
        ('CLOSED', 'LEVEL_1_BS', true, false, 0, 'AUD', 'LEVEL1.BS.CL'),
        ('CLOSED', 'LEVEL_1_BS', false, true, 0, 'AUD', 'LEVEL1.BS.RE.CL'),
        ('CLOSED', 'LEVEL_1_BS', true, true, 0, 'AUD', 'LEVEL1.BS.RE.CL'),
        
        --LEVEL TWO
        ('CLOSED', 'LEVEL_2', false, false, 0, 'AUD', 'LEVEL2.CL'),
        ('CLOSED', 'LEVEL_2', true, false, 0, 'AUD', 'LEVEL2.CL'),
        ('CLOSED', 'LEVEL_2', false, true, 0, 'AUD', 'LEVEL2.RE.CL'),
        ('CLOSED', 'LEVEL_2', true, true, 0, 'AUD', 'LEVEL2.RE.CL'),
        
        -- INTERMEDIATE TRAINER
        ('CLOSED', 'INTERMEDIATE_TRAINER', false, false, 0, 'AUD', 'INT.CL'),
        ('CLOSED', 'INTERMEDIATE_TRAINER', false, true, 0, 'AUD', 'INT.RE.CL'),
        
        -- FOUNDATION TRAINER PLUS
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', false, false, 0, 'AUD', 'FTP.CL'),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', false, true, 0, 'AUD', 'FTP.RE.CL')
        
        ON CONFLICT DO NOTHING;
        
        
