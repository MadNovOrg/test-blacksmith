CREATE TABLE "public"."resource_packs_pricing" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_type" text NOT NULL, "course_level" text NOT NULL, "reaccred" boolean NOT NULL, "resource_packs_type" text NOT NULL, "resource_packs_delivery_type" text, "AUD_price" numeric NOT NULL, "NZD_price" numeric NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("course_type") REFERENCES "public"."course_type"("name") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("course_level") REFERENCES "public"."course_level"("name") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("resource_packs_type") REFERENCES "public"."resource_packs_type"("name") ON UPDATE no action ON DELETE no action, FOREIGN KEY ("resource_packs_delivery_type") REFERENCES "public"."resource_packs_delivery_type"("name") ON UPDATE no action ON DELETE no action, UNIQUE ("course_type", "course_level", "reaccred", "resource_packs_type", "resource_packs_delivery_type"));COMMENT ON TABLE "public"."resource_packs_pricing" IS E'Updated version of resource pack pricings';
CREATE EXTENSION IF NOT EXISTS pgcrypto;


INSERT INTO resource_packs_pricing (course_type, course_level, resource_packs_type, resource_packs_delivery_type, reaccred,  "AUD_price", "NZD_price") VALUES
-- OPEN
    -- LEVEL 1
        -- DIGITAL_WORKBOOK
            ('OPEN','LEVEL_1','DIGITAL_WORKBOOK', null, false, 46, 50),
            
        -- PRINT_WORKBOOK
            ('OPEN','LEVEL_1','PRINT_WORKBOOK', null, false, 52, 57),

    -- LEVEL 2
        -- DIGITAL_WORKBOOK
            ('OPEN','LEVEL_2','DIGITAL_WORKBOOK', null, false, 41, 45),
        -- PRINT_WORKBOOK
            ('OPEN','LEVEL_2','PRINT_WORKBOOK', null, false, 41, 45),

    -- INTERMEDIATE TRAINER
        -- PRINT_WORKBOOK
            ('OPEN','INTERMEDIATE_TRAINER','PRINT_WORKBOOK', null, false, 41, 45),
            ('OPEN','INTERMEDIATE_TRAINER','PRINT_WORKBOOK', null, true, 41, 45),

    -- FOUNDATION TRAINER
        -- DIGITAL_WORKBOOK
            ('OPEN','FOUNDATION_TRAINER','DIGITAL_WORKBOOK', null, false, 35, 38),
            ('OPEN','FOUNDATION_TRAINER','DIGITAL_WORKBOOK', null, true, 35, 38),
        -- PRINT_WORKBOOK
            ('OPEN','FOUNDATION_TRAINER','PRINT_WORKBOOK', null, false, 41, 45),
            ('OPEN','FOUNDATION_TRAINER','PRINT_WORKBOOK', null, true, 41, 45),

    -- FOUNDATION TRAINER PLUS
        -- PRINT_WORKBOOK
            ('OPEN','FOUNDATION_TRAINER_PLUS','PRINT_WORKBOOK', null, false, 41, 45),
            ('OPEN','FOUNDATION_TRAINER_PLUS','PRINT_WORKBOOK', null, true, 41, 45),

-- CLOSED
    -- LEVEL 1
        -- DIGITAL_WORKBOOK
            ('CLOSED', 'LEVEL_1', 'DIGITAL_WORKBOOK', null, false, 46, 50),
            ('CLOSED', 'LEVEL_1', 'DIGITAL_WORKBOOK', null, true, 46, 50),
        -- PRINT_WORKBOOK
            ('CLOSED', 'LEVEL_1', 'PRINT_WORKBOOK', null, false, 52, 57),
            ('CLOSED', 'LEVEL_1', 'PRINT_WORKBOOK', null, true, 52, 57),

    -- LEVEL 1 BEHAVIOUR SUPPORT
        -- PRINT_WORKBOOK
            ('CLOSED', 'LEVEL_1_BS', 'PRINT_WORKBOOK', null, false, 52, 57),
            ('CLOSED', 'LEVEL_1_BS', 'PRINT_WORKBOOK', null, true, 52, 57),

    -- LEVEL 2
        -- PRINT_WORKBOOK
            ('CLOSED', 'LEVEL_2', 'PRINT_WORKBOOK', null, false, 41, 45),
            ('CLOSED', 'LEVEL_2', 'PRINT_WORKBOOK', null, true, 41, 45),
        
    -- INTERMEDIATE TRAINER
        -- PRINT_WORKBOOK
            ('CLOSED', 'INTERMEDIATE_TRAINER', 'PRINT_WORKBOOK', null, false, 41, 45),
            ('CLOSED', 'INTERMEDIATE_TRAINER', 'PRINT_WORKBOOK', null, true, 41, 45),
        
    -- FOUNDATION TRAINER
        -- DIGITAL_WORKBOOK
            ('CLOSED', 'FOUNDATION_TRAINER', 'DIGITAL_WORKBOOK', null, false, 35, 38),
            ('CLOSED', 'FOUNDATION_TRAINER', 'DIGITAL_WORKBOOK', null, true, 35, 38),
        -- PRINT_WORKBOOK
            ('CLOSED', 'FOUNDATION_TRAINER', 'PRINT_WORKBOOK', null, false, 41, 45),
            ('CLOSED', 'FOUNDATION_TRAINER', 'PRINT_WORKBOOK', null, true, 41, 45),

    -- FOUNDATION TRAINER PLUS
        -- PRINT_WORKBOOK
            ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'PRINT_WORKBOOK', null, false, 41, 45),
            ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'PRINT_WORKBOOK', null, true, 41, 45),

-- INDIRECT
    -- LEVEL 1
        -- DIGITAL_WORKBOOK
            ('INDIRECT','LEVEL_1','DIGITAL_WORKBOOK', null, false, 46, 50),
        -- PRINT_WORKBOOK
            -- STANDARD
                ('INDIRECT','LEVEL_1','PRINT_WORKBOOK', 'STANDARD', false, 52, 57),
            -- EXPRESS
                ('INDIRECT','LEVEL_1','PRINT_WORKBOOK', 'EXPRESS', false, 57, 62.5),
            
    -- LEVEL 1 NON PHYSICAL
        -- DIGITAL_WORKBOOK
            ('INDIRECT','LEVEL_1_NP','DIGITAL_WORKBOOK', null, false, 46, 50),
        -- PRINT_WORKBOOK
            -- STANDARD
                ('INDIRECT','LEVEL_1_NP','PRINT_WORKBOOK', 'STANDARD', false, 52, 57),
            -- EXPRESS
                ('INDIRECT','LEVEL_1_NP','PRINT_WORKBOOK', 'EXPRESS', false, 57, 62.5),

    -- LEVEL 1 BEHAVIOUR SUPPORT
        -- DIGITAL_WORKBOOK
            ('INDIRECT','LEVEL_1_BS','DIGITAL_WORKBOOK', null, false, 46, 50),
        -- PRINT_WORKBOOK
            -- STANDARD
                ('INDIRECT','LEVEL_1_BS','PRINT_WORKBOOK', 'STANDARD', false, 52, 57),
            -- EXPRESS
                ('INDIRECT','LEVEL_1_BS','PRINT_WORKBOOK', 'EXPRESS', false, 57, 62.5),
 
     -- LEVEL 2
        -- DIGITAL_WORKBOOK
            ('INDIRECT','LEVEL_2','DIGITAL_WORKBOOK', null, false, 35, 38),
        -- PRINT_WORKBOOK
            -- STANDARD
                ('INDIRECT','LEVEL_2','PRINT_WORKBOOK', 'STANDARD', false, 41, 45),
            -- EXPRESS
                ('INDIRECT','LEVEL_2','PRINT_WORKBOOK', 'EXPRESS', false, 46, 50.5);
