DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'module_setting' 
        AND column_name = 'shard'
    ) THEN
        ALTER TABLE "public"."module_setting" 
        ADD COLUMN "shard" TEXT NOT NULL DEFAULT 'UK';
    END IF;
END $$;

INSERT INTO module_v2("display_name", "name", "lessons") VALUES 
('Theory', 'Theory Level One NP ANZ', '{
  "items": [
    {
      "name": "Our Why"
    },
    {
      "name": "Values"
    },
    {
      "name": "Behaviours of Communication"
    },
    {
      "name": "Functions of Behaviour"
    },
    {
      "name": "Law, Guidance & Best Practice"
    },
    {
      "name": "Stages of Distress and Support"
    },
    {
      "name": "Individual Support Planning"
    },
    {
      "name": "Confilict Spiral and Cycle of Influence"
    },
    {
      "name": "Fizzy Pop Challenge"
    },
    {
      "name": "Listening and Learning"
    },
    {
      "name": "Quiz"
    }
  ]
}'),
 ('Communication', 'Communication Level One NP ANZ', '{
  "items": [
    {
      "name": "Personal Space, Body Language & Calm Stance"
    },
    {
      "name": "Circles of Awareness and Danger"
    },
    {
      "name": "Verbal Communication & Help Scripts"
    },
    {
      "name": "CALM Communication"
    }
  ]
}') ON CONFLICT ("name") DO NOTHING;


INSERT INTO module_setting("course_level", "reaccreditation", "go1_integration", "color", "duration", "course_delivery_type", "course_type", "module_name", "sort", "mandatory", "conversion", "shard") VALUES
--INDIRECT
    -- F2F
            (E'LEVEL_1_NP', false, false, 'navy', 240, 'F2F','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', false, false, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', false, true, 'navy', 240, 'F2F','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', false, true, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', true, false, 'navy', 240, 'F2F','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', true, false, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', true, true, 'navy', 240, 'F2F','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', true, true, 'navy', 60, 'F2F','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),


    -- VIRTUAL
            (E'LEVEL_1_NP', false, false, 'navy', 240, 'VIRTUAL','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', false, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', false, true, 'navy', 240, 'VIRTUAL','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', false, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', true, false, 'navy', 240, 'VIRTUAL','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', true, false, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', true, true, 'navy', 240, 'VIRTUAL','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', true, true, 'navy', 60, 'VIRTUAL','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),


    --MIXED
            (E'LEVEL_1_NP', false, false, 'navy', 240, 'MIXED','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', false, false, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', false, true, 'navy', 240, 'MIXED','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', false, true, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', true, false, 'navy', 240, 'MIXED','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', true, false, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ'),

            (E'LEVEL_1_NP', true, true, 'navy', 240, 'MIXED','INDIRECT', 'Theory Level One NP ANZ', 1, true, false, 'ANZ'),
            (E'LEVEL_1_NP', true, true, 'navy', 60, 'MIXED','INDIRECT', 'Communication Level One NP ANZ', 2, true, false, 'ANZ')
            ON CONFLICT DO NOTHING;