CREATE TABLE "public"."anz_resource_packs_pricing" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "course_type" text NOT NULL, "course_level" text NOT NULL, "course_delivery_type" text NOT NULL,"reaccred" boolean NOT NULL, "currency" text NOT NULL, "price" numeric NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("course_type") REFERENCES "public"."course_type"("name") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("course_level") REFERENCES "public"."course_level"("name") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("course_delivery_type") REFERENCES "public"."course_delivery_type"("name") ON UPDATE cascade ON DELETE cascade, UNIQUE ("course_type", "course_level", "course_delivery_type", "reaccred", "currency"));COMMENT ON TABLE "public"."anz_resource_packs_pricing" IS E'This table stores the values for the resource packs in dependance to course level, type, delivery type and currency. Having a table instead of a const in code makes it easier to update, expand and read both in hub and hub-api.';
CREATE EXTENSION IF NOT EXISTS pgcrypto;


INSERT INTO anz_resource_packs_pricing (course_type, course_level, course_delivery_type, reaccred, currency, price) VALUES
-- OPEN
    -- LEVEL 1
        ('OPEN', 'LEVEL_1', 'VIRTUAL', false, 'AUD', 46),
        ('OPEN', 'LEVEL_1', 'VIRTUAL', false, 'NZD', 50),
        ('OPEN', 'LEVEL_1', 'F2F', false, 'AUD', 52),
        ('OPEN', 'LEVEL_1', 'F2F', false, 'NZD', 57),

    -- LEVEL 2
        ('OPEN', 'LEVEL_2', 'F2F', false, 'AUD', 41),
        ('OPEN', 'LEVEL_2', 'F2F', false, 'NZD', 45),
        ('OPEN', 'LEVEL_2', 'MIXED', false, 'AUD', 41),
        ('OPEN', 'LEVEL_2', 'MIXED', false, 'NZD', 45),

    -- INTERMEDIATE TRAINER
        ('OPEN', 'INTERMEDIATE_TRAINER', 'F2F', false, 'AUD', 41),
        ('OPEN', 'INTERMEDIATE_TRAINER', 'F2F', false, 'NZD', 45),
        ('OPEN', 'INTERMEDIATE_TRAINER', 'F2F', true, 'AUD', 41),
        ('OPEN', 'INTERMEDIATE_TRAINER', 'F2F', true, 'NZD', 45),

    -- FOUNDATION TRAINER
        ('OPEN', 'FOUNDATION_TRAINER', 'VIRTUAL', false, 'AUD', 35),
        ('OPEN', 'FOUNDATION_TRAINER', 'VIRTUAL', false, 'NZD', 38),
        ('OPEN', 'FOUNDATION_TRAINER', 'MIXED', false, 'AUD', 41),
        ('OPEN', 'FOUNDATION_TRAINER', 'MIXED', false, 'NZD', 45),
        ('OPEN', 'FOUNDATION_TRAINER', 'VIRTUAL', true, 'AUD', 35),
        ('OPEN', 'FOUNDATION_TRAINER', 'VIRTUAL', true, 'NZD', 38),
        ('OPEN', 'FOUNDATION_TRAINER', 'MIXED', true, 'AUD', 41),
        ('OPEN', 'FOUNDATION_TRAINER', 'MIXED', true, 'NZD', 45),

    -- FOUNDATION TRAINER PLUS
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'F2F', false, 'AUD', 41),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'F2F', false, 'NZD', 45),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'MIXED', false, 'AUD', 41),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'MIXED', false, 'NZD', 45),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'F2F', true, 'AUD', 41),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'F2F', true, 'NZD', 45),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'MIXED', true, 'AUD', 41),
        ('OPEN', 'FOUNDATION_TRAINER_PLUS', 'MIXED', true, 'NZD', 45),

-- CLOSED
    -- LEVEL 1
        ('CLOSED', 'LEVEL_1', 'VIRTUAL', false, 'AUD', 46),
        ('CLOSED', 'LEVEL_1', 'VIRTUAL', false, 'NZD', 50),
        ('CLOSED', 'LEVEL_1', 'F2F', false, 'AUD', 52),
        ('CLOSED', 'LEVEL_1', 'F2F', false, 'NZD', 57),
        ('CLOSED', 'LEVEL_1', 'MIXED', false, 'AUD', 52),
        ('CLOSED', 'LEVEL_1', 'MIXED', false, 'NZD', 57),
        ('CLOSED', 'LEVEL_1', 'VIRTUAL', true, 'AUD', 46),
        ('CLOSED', 'LEVEL_1', 'VIRTUAL', true, 'NZD', 50),
        ('CLOSED', 'LEVEL_1', 'F2F', true, 'AUD', 52),
        ('CLOSED', 'LEVEL_1', 'F2F', true, 'NZD', 57),
        ('CLOSED', 'LEVEL_1', 'MIXED', true, 'AUD', 52),
        ('CLOSED', 'LEVEL_1', 'MIXED', true, 'NZD', 57),

    -- LEVEL 2
        ('CLOSED', 'LEVEL_2', 'F2F', false, 'AUD', 41),
        ('CLOSED', 'LEVEL_2', 'F2F', false, 'NZD', 45),
        ('CLOSED', 'LEVEL_2', 'MIXED', false, 'AUD', 41),
        ('CLOSED', 'LEVEL_2', 'MIXED', false, 'NZD', 45),
        ('CLOSED', 'LEVEL_2', 'F2F', true, 'AUD', 41),
        ('CLOSED', 'LEVEL_2', 'F2F', true, 'NZD', 45),
        ('CLOSED', 'LEVEL_2', 'MIXED', true, 'AUD', 41),
        ('CLOSED', 'LEVEL_2', 'MIXED', true, 'NZD', 45),

    -- INTERMEDIATE TRAINER
        ('CLOSED', 'INTERMEDIATE_TRAINER', 'F2F', false, 'AUD', 41),
        ('CLOSED', 'INTERMEDIATE_TRAINER', 'F2F', false, 'NZD', 45),
        ('CLOSED', 'INTERMEDIATE_TRAINER', 'F2F', true, 'AUD', 41),
        ('CLOSED', 'INTERMEDIATE_TRAINER', 'F2F', true, 'NZD', 45),
    
    -- FOUNDATION TRAINER
        ('CLOSED', 'FOUNDATION_TRAINER', 'MIXED', false, 'AUD', 41),
        ('CLOSED', 'FOUNDATION_TRAINER', 'MIXED', false, 'NZD', 45),
        ('CLOSED', 'FOUNDATION_TRAINER', 'MIXED', true, 'AUD', 41),
        ('CLOSED', 'FOUNDATION_TRAINER', 'MIXED', true, 'NZD', 45),
        ('CLOSED', 'FOUNDATION_TRAINER', 'VIRTUAL', false, 'AUD', 35),
        ('CLOSED', 'FOUNDATION_TRAINER', 'VIRTUAL', false, 'NZD', 38),
        ('CLOSED', 'FOUNDATION_TRAINER', 'VIRTUAL', true, 'AUD', 35),
        ('CLOSED', 'FOUNDATION_TRAINER', 'VIRTUAL', true, 'NZD', 38),

    -- FOUNDATION TRAINER PLUS
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'F2F', false, 'AUD', 41),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'F2F', false, 'NZD', 45),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'F2F', true, 'AUD', 41),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'F2F', true, 'NZD', 45),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'MIXED', false, 'AUD', 41),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'MIXED', false, 'NZD', 45),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'MIXED', true, 'AUD', 41),
        ('CLOSED', 'FOUNDATION_TRAINER_PLUS', 'MIXED', true, 'NZD', 45),

    -- LEVEL 1 BEHAVIOUR SUPPORT
        ('CLOSED', 'LEVEL_1_BS', 'F2F', false, 'AUD', 52),
        ('CLOSED', 'LEVEL_1_BS', 'F2F', false, 'NZD', 57),
        ('CLOSED', 'LEVEL_1_BS', 'MIXED', false, 'AUD', 52),
        ('CLOSED', 'LEVEL_1_BS', 'MIXED', false, 'NZD', 57),
        ('CLOSED', 'LEVEL_1_BS', 'F2F', true, 'AUD', 52),
        ('CLOSED', 'LEVEL_1_BS', 'F2F', true, 'NZD', 57),
        ('CLOSED', 'LEVEL_1_BS', 'MIXED', true, 'AUD', 52),
        ('CLOSED', 'LEVEL_1_BS', 'MIXED', true, 'NZD', 57);